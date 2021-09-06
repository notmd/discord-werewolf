import {
  Collection,
  GuildMember,
  Message,
  Permissions,
  TextChannel,
  VoiceChannel,
} from 'discord.js'
import { Arguments } from 'yargs'

import {
  CHANNEL_NAME_PREFIX,
  gameSettings,
  MAIN_TEXT_CHANNEL,
  MAIN_VOICE_CHANNLE,
  Role,
  WOLFS,
} from '../../game-settings'
import _ from 'lodash'
import { gameState } from '../../game-state'
import { Player } from '../../player'
import { IRole } from '../../roles/role.interface'
import { logger } from '../../logger'
import { givePermissionFor, parseMention } from '../../helper'
import { sleep } from '../../utils'
export class StartGameCommandHandler {
  private readonly roles: Map<string, number>
  private readonly totalRolesCount: number
  private ignoreUserIds: Set<string>
  constructor(
    private message: Message,
    private argv: Arguments<{
      roles?: string
      ignore?: string
      controller?: string
    }>
  ) {
    const rolesArg = this.argv.roles as string
    const splittedRole = rolesArg
      .split(',')
      .map((r) => r.trim().split(':')) as Array<[string, string]>
    this.roles = new Map(
      splittedRole.map((role) => [role[0], parseInt(role[1])])
    )
    this.totalRolesCount = _(splittedRole)
      .map((role) => parseInt(role[1] as string))
      .sum()
    this.ignoreUserIds = this.parseIgnore()
    if (argv.controller) {
      const controller = parseMention(argv.controller)
      if (controller) {
        this.ignoreUserIds.add(controller)
        gameState.controller = controller
      }
    }
  }

  async handle() {
    if (gameState.isRunning) {
      this.message.reply(`Game already started.`)
      return
    }
    const mainVoiceChannel = await this.getMainVoiceChannelFromDiscord()
    const mainTextChannel = await this.getMainTextChannelFromDiscord()
    if (!mainVoiceChannel) {
      await this.message.reply(
        `Can not find ${
          CHANNEL_NAME_PREFIX + MAIN_VOICE_CHANNLE
        } voice channel. Please run \`!ww init\` command first`
      )
      return
    }
    if (!(await this.validateMainTextChannel(mainTextChannel))) return
    if (!(await this.validateRoles())) return
    const players = await this.fetchPlayers(mainVoiceChannel)
    if (!(await this.validatePlayers(players))) return

    this.revokeTextChannelsPermissions()
    const roleAssignedPlayers = this.assignRoleToPlayers(players)
    gameState.setMainVoiceChannel(mainVoiceChannel)
    gameState.setPlayers(roleAssignedPlayers)
    gameState.setIsRunning(true)
    gameState.otherTextChannels.set('main', mainTextChannel as TextChannel)
    gameState.setTextChannels(
      this.fetchTextChannels() as Collection<string, TextChannel>
    )
    logger.info('Generating roles.')
    await this.assignPermisstionToPlayers(roleAssignedPlayers)
    this.message.reply('Game started. Please checkout your roles.')
    logger.info('Game started.')
  }

  private async validateMainTextChannel(channel: TextChannel | undefined) {
    if (!channel) {
      await this.message.reply(
        `Can not find ${
          CHANNEL_NAME_PREFIX + MAIN_TEXT_CHANNEL
        } text channel. Please run \`!ww init\` command first`
      )
      return false
    }
    return true
  }

  private async sendRoleAssignedNotificationMessage(
    player: Player,
    channel: TextChannel
  ) {
    const roleName =
      player.role.in(WOLFS) && channel.name.includes(Role.WereWolf)
        ? 'Sói'
        : player.role.name
    await channel.send(`${player.raw} là ${roleName} ${player.role.icon}.`)
  }

  private assignRoleToPlayers(players: Collection<string, GuildMember>) {
    const generatedRoles = _(this.generateRole()).shuffle().shuffle().value()
    return Array.from(players.values()).map((p, i) => {
      return Player.fromDiscord(p, generatedRoles[i] as IRole)
    })
  }

  private async assignPermisstionToPlayers(players: Player[]) {
    let villagerIndex = 1
    for (const player of players) {
      if (player.role.roomName !== undefined) {
        const romeNames = Array.isArray(player.role.roomName)
          ? player.role.roomName
          : [player.role.roomName]
        for (const room of romeNames) {
          const channel = gameState.findChannel(room) as TextChannel
          await sleep(1000)
          await givePermissionFor(channel, player)
          await this.sendRoleAssignedNotificationMessage(player, channel)
        }
      } else if (player.role.is(Role.Villager)) {
        const channelName = `${Role.Villager}_${villagerIndex}`
        let channel = gameState.findChannel(channelName as Role)
        if (!channel) {
          channel = (await this.message.guild?.channels.create(
            `${CHANNEL_NAME_PREFIX}${channelName}`,
            {
              type: 'GUILD_TEXT',
              permissionOverwrites: [
                {
                  deny: Permissions.FLAGS.VIEW_CHANNEL,
                  id: this.message.guild.roles.everyone,
                },
              ],
            }
          )) as TextChannel
        }
        sleep(1000)
        await givePermissionFor(channel, player)
        await this.sendRoleAssignedNotificationMessage(player, channel)
        villagerIndex++
      }
    }
  }

  private generateRole(): IRole[] {
    const roles: IRole[] = []
    this.roles.forEach((num, role) => {
      for (let i = 0; i < num; i++) {
        roles.push(gameSettings.roles.get(role as Role) as IRole)
      }
    })
    return roles
  }

  private async validatePlayers(players: Collection<string, GuildMember>) {
    if (players.size === 0) {
      await this.message.reply(
        `Please join the \`${CHANNEL_NAME_PREFIX}${MAIN_VOICE_CHANNLE}\` channel first.`
      )
      return false
    }
    if (players.size !== this.totalRolesCount) {
      await this.message.reply(
        `Total roles should be equal to ${players.size}. ${this.totalRolesCount} given.`
      )
      return false
    }
    return true
  }

  private async validateRoles() {
    const invalidRoles = Array.from(this.roles.keys()).filter((role) => {
      return !gameSettings.roles.has(role as Role)
    })

    if (invalidRoles.length > 0) {
      await this.message.reply(
        `The following roles were invalid: ${invalidRoles.join(', ')}`
      )
      return false
    }
    return true
  }

  private async getMainVoiceChannelFromDiscord(): Promise<
    VoiceChannel | undefined
  > {
    const channels = await this.message.guild?.channels.fetch(undefined, {
      force: true,
    })
    const channel = channels?.find(
      (channel) =>
        channel.isVoice() &&
        channel.name === CHANNEL_NAME_PREFIX + MAIN_VOICE_CHANNLE
    )

    return channel as VoiceChannel | undefined
  }
  private async getMainTextChannelFromDiscord(): Promise<
    TextChannel | undefined
  > {
    const channels = await this.message.guild?.channels.fetch(undefined, {
      force: true,
    })
    const channel = channels?.find(
      (channel) =>
        channel.isText() &&
        channel.name === CHANNEL_NAME_PREFIX + MAIN_TEXT_CHANNEL
    )

    return channel as TextChannel | undefined
  }

  private async fetchPlayers(channel: VoiceChannel) {
    const fetchChannel = (await channel.fetch(true)) as VoiceChannel
    return fetchChannel.members.filter(
      (member) => !member.user.bot && !this.ignoreUserIds.has(member.user.id)
    )
  }

  private async revokeTextChannelsPermissions() {
    const channels = this.fetchTextChannels()
    if (channels) {
      for (const channel of channels.values()) {
        if (channel.name !== CHANNEL_NAME_PREFIX + MAIN_TEXT_CHANNEL) {
          await channel.edit({
            permissionOverwrites: [
              {
                deny: Permissions.FLAGS.VIEW_CHANNEL,
                id: this.message.guild!.roles.everyone,
              },
            ],
          })
        }
      }
    }
  }

  private fetchTextChannels() {
    return this.message.guild?.channels.cache.filter(
      (channel) =>
        channel.isText() && channel.name.startsWith(CHANNEL_NAME_PREFIX)
    ) as Collection<string, TextChannel> | undefined
  }

  private parseIgnore() {
    const res: Set<string> = new Set()
    if (!this.argv.ignore) return res
    const ignores = this.argv.ignore.trim().split(',')
    ignores.forEach((ignore) => {
      const mention = parseMention(ignore)
      mention && res.add(mention)
    })
    return res
  }
}

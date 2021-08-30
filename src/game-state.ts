import { Collection, Snowflake, TextChannel, VoiceChannel } from 'discord.js'
import { isString } from 'lodash'
import { CHANNEL_NAME_PREFIX, Role } from './game-settings'
import { Player } from './player'
import { IRole } from './roles/role.interface'

export class GameState {
  controller?: string
  isRunning: boolean = false
  voiceChannels: {
    main?: VoiceChannel
    death?: VoiceChannel
  }
  roleTextChannels: Map<Role, TextChannel> = new Map()
  otherTextChannels: Map<'main', TextChannel> = new Map()

  players: Player[] = []

  deathPlayers: Set<string> = new Set()
  lastRoundDeath: Set<string> = new Set()
  lastRoundActualDeath: Set<string> = new Set()

  bodyGuardLastSelection: null | string = null // userid
  bodyGuardSelection: null | string = null //userId

  witchUseKilled: boolean = false
  witchUseSaved: boolean = false

  mayorId?: Snowflake
  constructor() {
    this.voiceChannels = {
      main: undefined,
      death: undefined,
    }
  }

  get alivePlayers() {
    return this.players.filter((p) => !p.isDeath)
  }

  setMainVoiceChannel(channel: VoiceChannel) {
    this.voiceChannels.main = channel
  }
  setDeathVoiceChannel(channel: VoiceChannel) {
    this.voiceChannels.death = channel
  }
  setPlayers(players: Player[]) {
    this.players = players
  }
  setIsRunning(val: boolean) {
    this.isRunning = val
  }
  setTextChannels(channels: Collection<string, TextChannel>) {
    channels.forEach((channel) => {
      this.roleTextChannels.set(
        channel.name.slice(CHANNEL_NAME_PREFIX.length) as Role,
        channel
      )
    })
  }

  findTextChannelByRole(role: IRole | Role): TextChannel | undefined {
    if (isString(role)) {
      return this.roleTextChannels.get(role)
    }
    if (role.roomName) {
      return this.roleTextChannels.get(role.roomName)
    }
    return undefined
  }

  findAllPlayersByRole(role: Role): Player[] {
    return this.players.filter((p) => p.role.id === role)
  }

  findPlayerByRole(role: Role | IRole) {
    const resolved = isString(role) ? role : role.id
    return this.players.find((p) => p.role.is(resolved))
  }

  /**
   * @deprecated move logic to Player class
   */
  markPlayerAsDeath(
    player: string | Player,
    options: {
      ignoreLastRoundActualDeath?: boolean
      ignoreLastRounDeath?: boolean
    } = {}
  ) {
    const playerId = isString(player) ? player : player.raw.id
    this.deathPlayers.add(playerId)
    if (!options.ignoreLastRoundActualDeath) {
      this.lastRoundActualDeath.add(playerId)
    }
    if (!options.ignoreLastRounDeath) {
      this.lastRoundDeath.add(playerId)
    }
  }

  // moveLastRoundActualDeathToDeath() {
  //   this.lastRoundActualDeath.forEach((playerId) =>
  //     this.deathPlayers.add(playerId)
  //   )
  // }

  findPlayer(playerId: string) {
    return this.players.find((p) => p.raw.id === playerId)
  }

  toJSON() {
    return {
      isRunning: this.isRunning,
      // channels: this.voiceChannels,
      // textChannels: Array.from(this.roleTextChannels.entries()).map((e) => {
      // return {
      // [e[0]]: e[1].name,
      // }
      // }),
      players: this.players,
      deathPlayers: Array.from(this.deathPlayers.values()).map((p) => {
        this.findPlayer(p)?.raw.nickname
      }),
      // lastRoundActualDeath:
    }
  }
}

export const gameState = new GameState()

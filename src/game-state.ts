import { Collection, Message, TextChannel, VoiceChannel } from 'discord.js'
import { isString } from 'lodash'
import { CHANNEL_NAME_PREFIX, RoleIds } from './game-settings'
import { Player } from './player'
import { IRole } from './roles/role.interface'

export class GameState {
  isRunning: boolean = false
  voiceChannels: {
    main?: VoiceChannel
    death?: VoiceChannel
  }
  roleTextChannels: Map<RoleIds, TextChannel> = new Map()
  otherTextChannels: Map<'main', TextChannel> = new Map()
  players: Player[] = []
  deathPlayers: Set<string> = new Set()
  lastRoundActualDeath: Set<string> = new Set()
  discussionVotingMessages: Message[] = []
  wereWoflVotingMessages: Message[] = []
  seerSelectionMessages: Message[] = []
  bodyGuardSelectionMessages: Message[] = []
  bodyGuardLastSelection: null | string = null // userid
  bodyGuardSelection: null | string = null //userId
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
        channel.name.slice(CHANNEL_NAME_PREFIX.length) as RoleIds,
        channel
      )
    })
  }
  setMainTextChannel(channel: TextChannel) {
    this.otherTextChannels.set('main', channel)
  }

  addWereWolfVotingMessage(m: Message) {
    this.wereWoflVotingMessages.push(m)
  }
  addDiscussionVotingMessage(m: Message) {
    this.discussionVotingMessages.push(m)
  }
  addSeerSelectionMessage(m: Message) {
    this.seerSelectionMessages.push(m)
  }

  findTextChannelByRole(role: IRole | RoleIds): TextChannel | undefined {
    if (isString(role)) {
      return this.roleTextChannels.get(role)
    }
    if (role.roomName) {
      return this.roleTextChannels.get(role.roomName)
    }
    return undefined
  }

  findAllPlayersByRole(role: RoleIds): Player[] {
    return this.players.filter((p) => p.role.id === role)
  }

  findPlayByRole(role: RoleIds) {
    return this.players.find((p) => p.role.id === role)
  }

  markPlayerAsDeath(
    player: string | Player,
    options: {
      ignoreLastRoundActualDeath?: boolean
    } = {}
  ) {
    const playerId = isString(player) ? player : player.raw.id
    this.deathPlayers.add(playerId)
    if (options.ignoreLastRoundActualDeath) {
      this.lastRoundActualDeath.add(playerId)
    }
  }

  clearVotingMessages(type: 'werewolf' | 'discussion' | 'seer') {
    if (type === 'werewolf') {
      this.wereWoflVotingMessages = []
    } else if (type === 'discussion') {
      this.discussionVotingMessages = []
    } else if (type === 'seer') {
      this.seerSelectionMessages = []
    }
  }

  clearLastRoundAcctualDeath() {
    this.lastRoundActualDeath.clear()
  }

  findPlayer(playerId: string) {
    return this.players.find((p) => p.raw.id === playerId)
  }

  toJSON() {
    return {
      isRunning: this.isRunning,
      channels: this.voiceChannels,
      textChannels: Array.from(this.roleTextChannels.entries()).map((e) => {
        return {
          [e[0]]: e[1].name,
        }
      }),
      players: this.players,
      deathPlayers: Array.from(this.deathPlayers.values()).map((p) => {
        this.findPlayer(p)?.raw.nickname
      }),
      // lastRoundActualDeath:
    }
  }
}

export const gameState = new GameState()

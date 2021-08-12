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
  wereWoflVotingMessages: Message[] = []
  discussionVotingMessages: Message[] = []
  lastRoundActualDeath: Set<string> = new Set()
  constructor() {
    this.voiceChannels = {
      main: undefined,
      death: undefined,
    }
  }

  get alivePlayers() {
    return this.players.filter((p) => !p.isDeath)
  }

  setMainVoiceChannelId(channel: VoiceChannel) {
    this.voiceChannels.main = channel
  }
  // setDeathVoiceChannelId(id: string) {
  // this.channels.voice.death = id
  // }
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

  findTextChannelByRole(role: IRole | RoleIds): TextChannel | undefined {
    return this.roleTextChannels.get(isString(role) ? role : role.id)
  }

  findAllPlayersByRole(role: RoleIds): Player[] {
    return this.players.filter((p) => p.role.id === role)
  }

  markPlayerAsDeath(player: string) {
    this.deathPlayers.add(player)
    this.lastRoundActualDeath.add(player)
  }

  clearVotingMessages(type: 'werewolf' | 'discussion') {
    if (type === 'werewolf') {
      this.wereWoflVotingMessages = []
    } else if (type === 'discussion') {
      this.discussionVotingMessages = []
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

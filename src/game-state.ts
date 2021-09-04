import { Collection, Snowflake, TextChannel, VoiceChannel } from 'discord.js'
import { isString } from 'lodash'
import { CHANNEL_NAME_PREFIX, Role } from './game-settings'
import { Player } from './player'
import { IRole } from './roles/role.interface'

export type FindPlayerByRoleOptions = {
  includeOriginal?: boolean
}

export class GameState {
  controller?: Snowflake
  isRunning: boolean = false
  round: number = 0
  voiceChannels: {
    main?: VoiceChannel
  }
  roleTextChannels: Map<Role, TextChannel> = new Map()
  otherTextChannels: Map<'main', TextChannel> = new Map()

  players: Player[] = []

  deathPlayers: Set<Snowflake> = new Set()
  lastRoundDeath: Set<Snowflake> = new Set()
  lastRoundActualDeath: Set<Snowflake> = new Set()

  bodyGuardLastSelection: null | Snowflake = null
  bodyGuardSelection: null | Snowflake = null

  witchUseKilled: boolean = false
  witchUseSaved: boolean = false

  mayorId?: Snowflake

  roleAssignedPlayers: Map<string, Role> = new Map() // debug only
  couple?: [Snowflake, Snowflake] = undefined

  blackwolfCurseAt?: number = undefined
  blackwolfCurse?: string

  constructor() {
    this.voiceChannels = {
      main: undefined,
    }
  }

  get alivePlayers() {
    return this.players.filter((p) => !p.isDeath)
  }

  setMainVoiceChannel(channel: VoiceChannel) {
    this.voiceChannels.main = channel
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

  findChannel(role: IRole | Role): TextChannel | undefined {
    if (isString(role)) {
      return this.roleTextChannels.get(role)
    }
    return this.roleTextChannels.get(role.id)
  }

  findAllPlayersByRole(role: Role): Player[] {
    return this.players.filter((p) => p.role.id === role)
  }

  findPlayerByRole(
    role: Role | IRole,
    { includeOriginal = false }: FindPlayerByRoleOptions = {}
  ) {
    const resolved = isString(role) ? role : role.id
    return this.players.find(
      (p) =>
        p.role.is(resolved) || (includeOriginal && p.originalRole.is(resolved))
    )
  }

  onBeforeWakeUp() {
    this.lastRoundActualDeath.clear()
    this.lastRoundDeath.clear()
  }

  onSleep() {
    this.lastRoundActualDeath.clear()
    this.lastRoundDeath.clear()
    this.players.forEach((p) => {
      p.role.onSleep && p.role.onSleep()
    })
    this.round++
  }

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
      roleAssignedPlayers: [...this.roleAssignedPlayers.entries()].map(
        ([name, role]) => {
          return `${name}: ${role}`
        }
      ),
      // lastRoundActualDeath:
    }
  }
}

export const gameState = new GameState()

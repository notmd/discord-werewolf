import { Collection, Snowflake, TextChannel, VoiceChannel } from 'discord.js'
import { isString } from 'lodash'
import { CHANNEL_NAME_PREFIX, Role } from './game-settings'
import { Player } from './player'
import { IRole } from './roles/role.interface'
import { DeathContext } from './types'

export type FindPlayerByRoleOptions = {
  includeOriginal?: boolean
}

export class GameState {
  controller?: Snowflake
  isRunning: boolean = false
  round: number = 0
  mainVoiceChannels?: VoiceChannel = undefined
  roleTextChannels: Map<Role, TextChannel> = new Map()
  otherTextChannels: Map<'main', TextChannel> = new Map()

  players: Player[] = []

  deathPlayers: Collection<Snowflake, DeathContext> = new Collection()
  // TODO: rename to pending death
  recentlyDeath: Set<Snowflake> = new Set()
  deathPlayerReportToWitch: Set<Snowflake> = new Set()

  bodyGuardLastSelection: null | Snowflake = null
  bodyGuardSelection: null | Snowflake = null

  witchUseKilled: boolean = false
  witchUseSaved: boolean = false

  mayorId?: Snowflake

  roleAssignedPlayers: Map<string, Role> = new Map() // debug only
  couple?: [Snowflake, Snowflake] = undefined

  blackwolfCurseAt?: number = undefined
  blackwolfCurse?: string

  whitewolfLastKillAt: number = 0 // round

  oldHagSelection?: Snowflake
  lastOlHagSelection?: Snowflake

  caveSelection?: Snowflake
  lastCaveSelection?: Snowflake

  constructor() {}

  get alivePlayers() {
    return this.players.filter((p) => !p.isDeath)
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

  findPlayerByRole<R extends IRole = IRole>(
    role: Role | IRole,
    { includeOriginal = false }: FindPlayerByRoleOptions = {}
  ) {
    const resolved = isString(role) ? role : role.id

    return this.players.find(
      (p) =>
        p.role.is(resolved) || (includeOriginal && p.originalRole.is(resolved))
    ) as undefined | Player<R>
  }

  hasRole(role: Exclude<Role, Role.Mayor | Role.Couple>): boolean {
    return gameState.players.some(
      (p) => p.role.is(role) || p.originalRole.is(role)
    )
  }

  async onWakeUp() {
    for (const player of this.players) {
      if (player.role.onWakeUp) {
        await player.role.onWakeUp()
      }
    }
  }

  async onSleep() {
    this.round++
    this.recentlyDeath.clear()
    this.deathPlayerReportToWitch.clear()
    for (const player of this.players) {
      if (player.role.onSleep) {
        await player.role.onSleep()
      }
    }
  }

  findPlayer(playerId: string) {
    return this.players.find((p) => p.raw.id === playerId)
  }

  toJSON() {
    return {
      players: this.players,
      deathPlayers: this.deathPlayers.map((deathContext, key) => {
        return {
          name: this.findPlayer(key)?.raw.displayName,
          by: isString(deathContext.by)
            ? deathContext.by
            : deathContext.by.role.name,
          round: deathContext.atRound,
        }
      }),
    }
  }
}

export const gameState = new GameState()

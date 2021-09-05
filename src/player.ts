import { GuildMember } from 'discord.js'
import { CoupleFaction } from './faction/couple.faction'
import { IFaction } from './faction/faction.interface'
import { Role, WOLFS } from './game-settings'
import { gameState } from './game-state'
import { IRole } from './roles/role.interface'
import { KillContext } from './types'

export class Player<R extends IRole = IRole> {
  readonly raw: GuildMember
  private _role: R
  private _originalRole: IRole
  constructor(disCordMember: GuildMember, role: R) {
    this.raw = disCordMember
    this._role = role
    this._originalRole = role
  }

  static fromDiscord(guildMember: GuildMember, role: IRole) {
    return new this(guildMember, role)
  }

  get role() {
    return this._role
  }

  get originalRole() {
    return this._originalRole
  }

  get isDeath() {
    return gameState.deathPlayers.has(this.raw.id)
  }

  get isAlive() {
    return !this.isDeath
  }

  get isGuarded() {
    return gameState.bodyGuardSelection === this.raw.id
  }

  get defaultFaction(): IFaction {
    return this._role.faction
  }

  get faction(): IFaction {
    if (this.isCouple) {
      const coupleHasWolf = gameState.couple!.some((playerId) =>
        gameState.findPlayer(playerId)?.role.in(WOLFS)
      )
      const coupleAllAreWolf = gameState.couple!.every((playerId) =>
        gameState.findPlayer(playerId)?.role.in(WOLFS)
      )
      if (coupleHasWolf && !coupleAllAreWolf) {
        return new CoupleFaction()
      }
    }
    return this.defaultFaction
  }

  get isCouple() {
    return !!gameState.couple?.includes(this.raw.id)
  }

  get canUseAbility() {
    return !this.isDeath && this.raw.id !== gameState.blackwolfCurse
  }

  get wasDeathRecently() {
    return gameState.recentlyActualDeath.has(this.raw.id)
  }

  onKill({ by }: KillContext) {
    gameState.recentlyDeath.add(this.raw.id)

    let shouldDeath: boolean = true
    if (this.isGuarded && by !== 'everyone' && by.role.is(Role.WereWolf)) {
      shouldDeath = false
    }

    if (shouldDeath) {
      gameState.deathPlayers.add(this.raw.id)
      gameState.recentlyActualDeath.add(this.raw.id)
      if (this.isCouple) {
        const otherId = gameState.couple!.find(
          (playerId) => this.raw.id !== playerId
        )
        if (otherId) {
          gameState.recentlyActualDeath.add(otherId)
          gameState.recentlyDeath.add(otherId)
          gameState.deathPlayers.add(otherId)
        }
      }
    }
  }

  setRole(role: R) {
    this._originalRole = this._role
    this._role = role
  }

  toJSON() {
    return {
      name: this.raw.nickname || this.raw.displayName,
      role: {
        name: this._role.name,
      },
      isDeath: this.isDeath,
    }
  }
}

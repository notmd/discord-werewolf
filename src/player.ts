import { GuildMember } from 'discord.js'
import { CoupleFaction } from './faction/couple.faction'
import { IFaction } from './faction/faction.interface'
import { WOLFS } from './game-settings'
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
      const callback = (playerId: string) =>
        gameState.findPlayer(playerId)?.role.in(WOLFS)
      const coupleHasWolf = gameState.couple!.some(callback)
      const coupleAllAreWolf = gameState.couple!.every(callback)

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
    return gameState.recentlyDeath.has(this.raw.id)
  }

  onKill({ by }: KillContext) {
    const res: Player[] = []
    let shouldDeath: boolean = true
    if (by !== 'everyone' && by.role.in(WOLFS)) {
      if (this.isGuarded) {
        shouldDeath = false
      }
      gameState.deathPlayerReportToWitch.add(this.raw.id)
    }

    if (shouldDeath) {
      gameState.deathPlayers.set(this.raw.id, {
        by,
        atRound: gameState.round,
      })
      gameState.recentlyDeath.add(this.raw.id)
      res.push(this)
      if (this.isCouple) {
        const otherId = gameState.couple!.find(
          (playerId) => this.raw.id !== playerId
        )
        if (otherId) {
          gameState.deathPlayers.set(otherId, {
            by: 'couple',
            atRound: gameState.round,
          })
          gameState.recentlyDeath.add(otherId)
          res.push(gameState.findPlayer(otherId) as Player)
        }
      }
    }

    return res
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

  toString() {
    return this.raw.toString()
  }
}

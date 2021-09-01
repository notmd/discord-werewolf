import { GuildMember } from 'discord.js'
import { CoupleFaction } from './faction/couple.faction'
import { IFaction } from './faction/faction.interface'
import { WolfFaction } from './faction/wolf.faction'
import { Role } from './game-settings'
import { gameState } from './game-state'
import { IRole } from './roles/role.interface'
import { KillContext } from './types'

export class Player {
  readonly raw: GuildMember
  private _role: IRole
  constructor(disCordMember: GuildMember, role: IRole) {
    this.raw = disCordMember
    this._role = role
  }

  static fromDiscord(guildMember: GuildMember, role: IRole) {
    return new this(guildMember, role)
  }

  get role() {
    return this._role
  }

  get isDeath() {
    return gameState.deathPlayers.has(this.raw.id)
  }

  get isGuarded() {
    return gameState.bodyGuardSelection === this.raw.id
  }

  get defaultFaction(): IFaction {
    return this._role.faction
  }

  get faction(): IFaction {
    if (this.isCouple) {
      const coupleHasWolf = gameState.couple!.some(
        (playerId) =>
          gameState.findPlayer(playerId)?.defaultFaction instanceof WolfFaction
      )
      if (coupleHasWolf) {
        return new CoupleFaction()
      }
    }
    return this.defaultFaction
  }

  get isCouple() {
    return !!gameState.couple?.includes(this.raw.id)
  }

  onKill({ by }: KillContext) {
    let shouldDeath: boolean = true
    if (this.isGuarded && by !== 'everyone' && by.role.is(Role.WereWolf)) {
      shouldDeath = false
    }

    // if (by === 'everyone' || by.role.is(Role.Witch)) {
    //   shouldDeath = true
    // }

    gameState.lastRoundDeath.add(this.raw.id)
    if (shouldDeath) {
      gameState.deathPlayers.add(this.raw.id)
      gameState.lastRoundActualDeath.add(this.raw.id)
      if (this.isCouple) {
        const otherId = gameState.couple!.find(
          (playerId) => this.raw.id !== playerId
        )
        if (otherId) {
          gameState.lastRoundActualDeath.add(otherId)
          gameState.lastRoundDeath.add(otherId)
          gameState.deathPlayers.add(otherId)
        }
      }
    }
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

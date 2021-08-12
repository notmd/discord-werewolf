import { GuildMember } from 'discord.js'
import { gameState } from './game-state'
import { IRole } from './roles/role.interface'

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

  toJSON() {
    return {
      isDeath: this.isDeath,
      role: this._role,
      name: this.raw.nickname || this.raw.displayName,
    }
  }
}

import { TextChannel } from 'discord.js'
import { Role } from '../game-settings'
import { gameState } from '../game-state'

export abstract class BaseRole {
  abstract readonly id: Role
  get channel() {
    return gameState.findChannel(this.id) as TextChannel
  }
  is(role: Role): boolean {
    return this.id === role
  }
  in(roles: Role[] | Readonly<Role[]>): boolean {
    return roles.some((role) => role === this.id)
  }
}

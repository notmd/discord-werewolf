import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { IRole } from './role.interface'

export class Hunter implements IRole {
  readonly id = Role.Hunter
  readonly name = 'Thợ săn'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Hunter
  readonly faction = new VillageFaction()
  readonly icon = '🔫'
  is(role: Role) {
    return this.id === role
  }
}

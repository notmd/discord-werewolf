import { WolfFaction } from '../faction/wolf.faction'
import { Role } from '../game-settings'
import { IRole } from './role.interface'

export class WereWolf implements IRole {
  readonly id = Role.WereWolf
  readonly name = 'Sói'
  readonly roleAssignedNotification = true
  readonly roomName = Role.WereWolf
  readonly faction = new WolfFaction()
  readonly icon = '🐺'
  is(role: Role) {
    return this.id === role
  }
}

import { RoleIds } from '../game-settings'
import { IRole } from './role.interface'

export class WereWolf implements IRole {
  readonly id = RoleIds.WereWolf
  readonly name = 'Sói'
  readonly roleAssignedNotification = true
  readonly roomName = RoleIds.WereWolf
  readonly faction = 'wolf'
}

import { RoleIds } from '../game-settings'
import { IRole } from './role.interface'

export class Seer implements IRole {
  readonly id = RoleIds.Villager
  readonly name = 'Tiên tri'
  readonly roleAssignedNotification = true
  readonly roomName = RoleIds.Seer
  readonly faction = 'village'
}

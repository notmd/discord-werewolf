import { RoleIds } from '../game-settings'
import { IRole } from './role.interface'

export class Villager implements IRole {
  readonly id = RoleIds.Villager
  readonly name = 'Dân làng'
  readonly roleAssignedNotification = false
  readonly roomName = undefined
  readonly faction = 'village'
}

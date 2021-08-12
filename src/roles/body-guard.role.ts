import { RoleIds } from '../game-settings'
import { Player } from '../player'
import { IRole } from './role.interface'

export class BodyGuard implements IRole {
  readonly id = RoleIds.BodyGuard
  readonly name = 'Bảo vệ'
  readonly faction = 'village'
  readonly roomName = RoleIds.BodyGuard
  readonly roleAssignedNotification = true
  is(role: RoleIds) {
    return this.id === role
  }
  kill(_player: Player | string) {
    throw new Error(`${this.name} can not kill anyone.`)
  }
}

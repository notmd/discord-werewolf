import { RoleIds } from '../game-settings'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Seer implements IRole {
  readonly id = RoleIds.Seer
  readonly name = 'Tiên tri'
  readonly roleAssignedNotification = true
  readonly roomName = RoleIds.Seer
  readonly faction = 'village'
  is(role: RoleIds) {
    return this.id === role
  }
  kill(_player: Player | string) {
    throw new Error(`${this.name} can not kill anyone.`)
  }
}

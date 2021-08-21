import { Role } from '../game-settings'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Villager implements IRole {
  readonly id = Role.Villager
  readonly name = 'Dân làng'
  readonly roleAssignedNotification = false
  readonly roomName = undefined
  readonly faction = 'village'
  is(role: Role) {
    return this.id === role
  }

  kill(_player: Player | string) {
    throw new Error('Villger can not kill anyone.')
  }

  onSleep() {
    // skip
  }
}

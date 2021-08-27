import { Role } from '../game-settings'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Lycan implements IRole {
  readonly id = Role.Lycan
  readonly name = 'Lycan'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Lycan
  readonly faction = 'village'
  readonly icon = '🐺👷'
  is(role: Role) {
    return this.id === role
  }

  kill(_player: Player | string) {
    throw new Error('Lycan can not kill anyone.')
  }

  onSleep() {
    // skip
  }
}

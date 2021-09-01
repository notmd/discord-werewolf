import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Cupid implements IRole {
  readonly id = Role.Cupid
  readonly name = 'Cupid'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Cupid
  readonly faction = new VillageFaction()
  readonly icon = '💘'
  is(role: Role) {
    return this.id === role
  }

  kill(_player: Player | string) {
    throw new Error('Cupid can not kill anyone.')
  }

  onSleep() {
    // skip
  }
}

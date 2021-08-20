import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Seer implements IRole {
  readonly id = Role.Seer
  readonly name = 'Tiên tri'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Seer
  readonly faction = 'village'
  is(role: Role) {
    return this.id === role
  }
  kill(_player: Player | string) {
    throw new Error(`${this.name} can not kill anyone.`)
  }

  cleanUpState() {
    gameState.seerSelectionMessages = []
  }
}

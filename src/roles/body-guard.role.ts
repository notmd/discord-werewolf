import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class BodyGuard implements IRole {
  readonly id = Role.BodyGuard
  readonly name = 'Bảo vệ'
  readonly faction = new VillageFaction()
  readonly roomName = Role.BodyGuard
  readonly roleAssignedNotification = true
  readonly icon = '🛡️'
  is(role: Role) {
    return this.id === role
  }
  kill(_player: Player | string) {
    throw new Error(`${this.name} can not kill anyone.`)
  }

  onBeforeWakeup() {
    gameState.bodyGuardLastSelection = gameState.bodyGuardSelection
    gameState.bodyGuardSelection = null
  }

  // canBeKill() {
  //   return true
  // }
}

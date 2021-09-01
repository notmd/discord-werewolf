import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class BodyGuard extends BaseRole implements IRole {
  readonly id = Role.BodyGuard
  readonly name = 'Bảo vệ'
  readonly faction = new VillageFaction()
  readonly roomName = Role.BodyGuard
  readonly roleAssignedNotification = true
  readonly icon = '🛡️'

  onBeforeWakeUp() {
    gameState.bodyGuardLastSelection = gameState.bodyGuardSelection
    gameState.bodyGuardSelection = null
  }
}

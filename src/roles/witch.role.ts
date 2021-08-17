import { RoleIds } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Witch implements IRole {
  readonly id = RoleIds.Witch
  readonly name = 'Phù thủy'
  readonly faction = 'village'
  readonly roomName = RoleIds.Witch
  readonly roleAssignedNotification = true
  is(role: RoleIds) {
    return this.id === role
  }
  kill(player: Player | string) {
    if (gameState.witchUseKilled) {
      throw new Error(`${this.id} has used posion.`)
    }

    gameState.markPlayerAsDeath(player)
  }

  cleanUpState() {
    gameState.witchKillSelectionMessages = []
    gameState.witchSaveSelectMessages = []
    gameState.witchSelectionMessages.clear()
  }
}

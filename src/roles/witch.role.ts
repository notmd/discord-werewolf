import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Witch implements IRole {
  readonly id = Role.Witch
  readonly name = 'Phù thủy'
  readonly faction = 'village'
  readonly roomName = Role.Witch
  readonly roleAssignedNotification = true
  readonly icon = '🧙‍♀️'
  is(role: Role) {
    return this.id === role
  }
  kill(player: Player | string) {
    if (gameState.witchUseKilled) {
      throw new Error(`${this.id} has used posion.`)
    }

    gameState.markPlayerAsDeath(player)
  }

  onSleep() {}
}

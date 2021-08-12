import { RoleIds } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class WereWolf implements IRole {
  readonly id = RoleIds.WereWolf
  readonly name = 'Sói'
  readonly roleAssignedNotification = true
  readonly roomName = RoleIds.WereWolf
  readonly faction = 'wolf'
  is(role: RoleIds) {
    return this.id === role
  }

  kill(player: Player | string) {
    gameState.markPlayerAsDeath(player.raw.id)
  }
}

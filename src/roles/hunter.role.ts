import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { Player } from '../player'
import { IRole } from './role.interface'

export class Hunter implements IRole {
  readonly id = Role.Hunter
  readonly name = 'Thợ săn'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Hunter
  readonly faction = 'village'
  is(role: Role) {
    return this.id === role
  }

  kill(player: Player | string) {
    gameState.markPlayerAsDeath(player, {
      ignoreLastRounDeath: true,
      ignoreLastRoundActualDeath: true,
    })
    const hunter = gameState.findPlayerByRole(this)
    if (hunter) {
      gameState.markPlayerAsDeath(hunter, {
        ignoreLastRounDeath: true,
        ignoreLastRoundActualDeath: true,
      })
    }
  }

  cleanUpState() {
    gameState.hunterSelectionMessages = []
  }
}

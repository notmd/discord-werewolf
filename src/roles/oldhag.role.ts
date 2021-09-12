import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { mute, unmute } from '../helper'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class OldHag extends BaseRole implements IRole {
  readonly id = Role.OldHag
  readonly name = 'Phù thủy già'
  readonly roomName = [Role.OldHag]
  readonly faction = new VillagerFaction()
  readonly icon = '🧑‍🦳'

  async onSleep() {
    if (gameState.oldHagSelection) {
      const player = gameState.findPlayerByRole(this.id)!
      await unmute(player)
    }
    gameState.lastOlHagSelection = gameState.oldHagSelection
    gameState.oldHagSelection = undefined
  }

  async onWakeUp() {
    if (gameState.oldHagSelection) {
      const player = gameState.findPlayerByRole(this.id)!
      await mute(player)
    }
  }
}

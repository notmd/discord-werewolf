import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Cave extends BaseRole implements IRole {
  readonly id = Role.Cave
  readonly name = 'Cave'
  readonly roomName = [Role.Cave]
  readonly faction = new VillagerFaction()
  readonly icon = '💃'

  async onSleep() {
    gameState.lastCaveSelectio = gameState.caveSelection
    gameState.caveSelection = undefined
  }
}

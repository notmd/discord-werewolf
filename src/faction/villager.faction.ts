import { gameState } from '../game-state'
import { IFaction } from './faction.interface'

export class VillagerFaction implements IFaction {
  get win() {
    return gameState.alivePlayers.every(
      (p) => p.faction instanceof VillagerFaction
    )
  }

  get victoryAnnouncement() {
    return `Phe dân làng đã thắng.`
  }
}

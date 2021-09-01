import { gameState } from '../game-state'
import { IFaction } from './faction.interface'

export class VillageFaction implements IFaction {
  get win() {
    return gameState.alivePlayers.every(
      (p) => p.faction instanceof VillageFaction
    )
  }

  get victoryAnnouncement() {
    return `Phe dân làng đã thắng.`
  }
}

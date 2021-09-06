import { gameState } from '../game-state'
import { IFaction } from './faction.interface'

export class WhiteWolfFaction implements IFaction {
  get win() {
    return gameState.alivePlayers.every(
      (p) => p.faction instanceof WhiteWolfFaction
    )
  }

  get victoryAnnouncement() {
    return `Phe sói trắng đã thắng.`
  }
}

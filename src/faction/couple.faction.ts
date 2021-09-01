import { gameState } from '../game-state'
import { IFaction } from './faction.interface'

export class CoupleFaction implements IFaction {
  get win() {
    return gameState.alivePlayers.every(
      (p) => p.faction instanceof CoupleFaction
    )
  }

  victoryAnnouncement = 'Phe cặp đôi đã chiến thắng.'
}

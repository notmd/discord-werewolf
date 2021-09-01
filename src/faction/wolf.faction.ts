import { gameState } from '../game-state'
import { IFaction } from './faction.interface'

export class WolfFaction implements IFaction {
  get win() {
    return gameState.alivePlayers.every((p) => p.faction instanceof WolfFaction)
  }

  get victoryAnnouncement() {
    return `Phe sói đã thắng.`
  }
}

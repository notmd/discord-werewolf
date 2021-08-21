import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { StartDisscusion } from './start-discussion.step'
import { IStep } from './step'

export class WakeUp implements IStep {
  readonly __is_step = true
  async handle() {
    const deathPlayerMeation = Array.from(
      gameState.lastRoundActualDeath.values()
    )
      .map((playerId) => {
        return gameState.findPlayer(playerId)?.raw
      })
      .join(', ')
    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(
      `Dậy đi nào các pạn nhỏ êi. Đêm qua ${deathPlayerMeation} đã chết.`
    )

    const hunter = gameState.findPlayerByRole(Role.Hunter)
    if (hunter && gameState.lastRoundActualDeath.has(hunter.raw.id)) {
      return new StartHunterTurn(true).handle()
    }

    return new StartDisscusion().handle()
  }
}

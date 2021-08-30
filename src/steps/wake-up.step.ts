import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { StartMayorVote } from './mayor/start-vote-mayor.step'
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
      `Dậy đi nào các pạn nhỏ êi. Đêm qua ${
        gameState.lastRoundActualDeath.size > 0
          ? `${deathPlayerMeation} đã chết.`
          : `hem ai chết cả.`
      } `
    )

    const hunter = gameState.findPlayerByRole(Role.Hunter)
    if (hunter && gameState.lastRoundActualDeath.has(hunter.raw.id)) {
      return new StartHunterTurn(true).handle()
    }

    if (
      !gameState.mayorId ||
      gameState.lastRoundActualDeath.has(gameState.mayorId)
    ) {
      return new StartMayorVote(true).handle()
    }

    return new StartDisscusion().handle()
  }
}

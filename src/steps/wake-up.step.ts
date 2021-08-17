import { gameState } from '../game-state'
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

    return new StartDisscusion().handle()
  }
}

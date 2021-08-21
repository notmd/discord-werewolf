import { gameState } from '../game-state'
import { logger } from '../logger'
import { StartBodyGuardTurn } from './bodyguard/start-body-guard-turn.step'
import { IStep } from './step'

export class StartSleep implements IStep {
  readonly __is_step = true

  async handle() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(`Đi ngủ thui nào các pạn nhỏ.`)
    logger.info('Start sleep.')
    gameState.lastRoundActualDeath.clear()
    gameState.lastRoundDeath.clear()
    gameState.players.forEach((p) => {
      p.role.onSleep && p.role.onSleep()
    })

    return new StartBodyGuardTurn().handle()
  }
}

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
    gameState.clearLastRoundAcctualDeath()
    gameState.discussionVotingMessages = []
    gameState.lastRoundDeath.clear()
    gameState.players.forEach((p) => {
      p.role.cleanUpState()
    })

    return new StartBodyGuardTurn().handle()
  }
}

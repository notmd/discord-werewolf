import { gameState } from '../game-state'
import { logger } from '../logger'
import { StartSeerTurn } from './seer/start-seer-turn.step'
import { IStep } from './step'

export class StartSleep implements IStep {
  readonly __is_step = true

  async handle() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(`Đi ngủ thui nào các pạn nhỏ.`)
    logger.info('Start sleep.')
    gameState.clearLastRoundAcctualDeath()
    gameState.clearVotingMessages('discussion')
    gameState.clearVotingMessages('werewolf')
    gameState.clearVotingMessages('seer')

    gameState.bodyGuardLastSelection = gameState.bodyGuardSelection
    gameState.bodyGuardSelection = null

    return new StartSeerTurn().handle()
  }
}

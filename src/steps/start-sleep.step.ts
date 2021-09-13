import { gameState } from '../game-state'
import { logger } from '../logger'
import { StartCaveTurn } from './cave/start-cave-turn.step'
import { IStep } from './step'

export class StartSleep implements IStep {
  async handle() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(`Đi ngủ thui nào các pạn nhỏ.`)
    logger.info('Start sleep.')
    await gameState.onSleep()

    return new StartCaveTurn().handle()
  }
}

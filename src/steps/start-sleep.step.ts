import { gameState } from '../game-state'
import { StartSeerTurn } from './seer/start-seer-turn.step'
import { IStep } from './step'

export class StartSleepStep implements IStep {
  readonly __is_step = true

  async handle() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(`Đi ngủ thui nào các pạn nhỏ.`)
    gameState.clearLastRoundAcctualDeath()
    gameState.clearVotingMessages('discussion')
    gameState.clearVotingMessages('werewolf')
    gameState.clearVotingMessages('seer')

    return new StartSeerTurn().handle()
  }
}

import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { shouldStartMayorVoting } from '../helper'
import { logger } from '../logger'
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { StartMayorVote } from './mayor/start-vote-mayor.step'
import { StartDisscusion } from './start-discussion.step'
import { IStep } from './step'

export class WakeUp implements IStep {
  private recentlyPlayerMeation: string
  constructor() {
    this.recentlyPlayerMeation = [...gameState.recentlyDeath.values()]
      .map((playerId) => {
        return gameState.findPlayer(playerId)?.raw
      })
      .join(', ')
  }

  async handle() {
    logger.info('Wake up.')
    this.runHooks()

    const mainTextChannel = gameState.otherTextChannels.get('main')
    await mainTextChannel?.send(
      `Dậy đi nào các pạn nhỏ êi. Đêm qua ${
        gameState.recentlyDeath.size > 0
          ? `${this.recentlyPlayerMeation} đã chết.`
          : `hem ai chết cả.`
      } `
    )

    const hunter = gameState.findPlayerByRole(Role.Hunter)
    if (hunter && gameState.recentlyDeath.has(hunter.raw.id)) {
      return new StartHunterTurn(true).handle()
    }

    if (shouldStartMayorVoting()) {
      return new StartMayorVote(true).handle()
    }

    return new StartDisscusion().handle()
  }

  private async runHooks() {
    gameState.onWakeUp()
  }
}

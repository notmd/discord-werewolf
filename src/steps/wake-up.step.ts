import { Role } from '../game-settings'
import { gameState } from '../game-state'
import { shouldStartMayorVoting } from '../hepler'
import { logger } from '../logger'
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { StartMayorVote } from './mayor/start-vote-mayor.step'
import { StartDisscusion } from './start-discussion.step'
import { IStep } from './step'

export class WakeUp implements IStep {
  private lastRoundActualDeath: typeof gameState.lastRoundActualDeath
  private deathPlayerMeation: string
  constructor() {
    this.lastRoundActualDeath = gameState.lastRoundActualDeath
    this.deathPlayerMeation = [...this.lastRoundActualDeath.values()]
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
        this.lastRoundActualDeath.size > 0
          ? `${this.deathPlayerMeation} đã chết.`
          : `hem ai chết cả.`
      } `
    )

    const hunter = gameState.findPlayerByRole(Role.Hunter)
    if (hunter && this.lastRoundActualDeath.has(hunter.raw.id)) {
      return new StartHunterTurn(true).handle()
    }

    if (shouldStartMayorVoting()) {
      return new StartMayorVote(true).handle()
    }

    return new StartDisscusion().handle()
  }

  private async runHooks() {
    gameState.alivePlayers.forEach((p) => {
      p.role.onBeforeWakeUp && p.role.onBeforeWakeUp()
    })
    gameState.onBeforeWakeUp()
  }
}

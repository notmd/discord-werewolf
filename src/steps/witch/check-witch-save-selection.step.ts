import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { getVotesFromMessages, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { Player } from '../../player'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'

export class CheckWitchSaveSelection implements IStep {
  readonly __is_step = true

  async handle() {
    logger.info('Checking Witch save selection.')
    const votingMessages = gameState.witchSaveSelectMessages
    const votes = await getVotesFromMessages(votingMessages)

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.players.find(
      (p) => p.raw.id === playerId
    ) as Player

    gameState.lastRoundActualDeath.delete(playerId)
    gameState.deathPlayers.delete(playerId)
    gameState.witchUseSaved = true

    await gameState
      .findTextChannelByRole(RoleIds.Witch)
      ?.send(`Bạn đã giết ${player?.raw.displayName}.`)

    return new WakeUp().handle()
  }
}

import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { getVotesFromMessages, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { Player } from '../../player'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'

export class CheckWitchKillSelection implements IStep {
  readonly __is_step = true

  async handle() {
    logger.info('Checking Witch kill selection.')
    const votingMessages = gameState.witchKillSelectionMessages
    const votes = await getVotesFromMessages(votingMessages)

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.players.find(
      (p) => p.raw.id === playerId
    ) as Player
    const witch = gameState.alivePlayers.find((p) => p.role.id === Role.Witch)
    try {
      witch?.role.kill(player)
      gameState.lastRoundActualDeath.add(playerId)
      gameState.witchUseKilled = true
      await gameState
        .findTextChannelByRole(Role.Witch)
        ?.send(`Bạn đã giết ${player?.raw.displayName}.`)
    } catch (e) {
      logger.error('Error while perform Witch kill step.')
      logger.error(e)
    }

    return new WakeUp().handle()
  }
}

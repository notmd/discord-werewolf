import { TextChannel } from 'discord.js'
import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { getVotesFromMessages, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'

export class CheckBodyGuardSelection implements IStep {
  readonly __is_step = true

  async handle() {
    logger.info('Checking Seer selection')
    const messages = gameState.bodyGuardSelectionMessages
    const votes = (await getVotesFromMessages(messages)).filter((v) => v > 0)
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')
      return new StartSeerTurn().handle()
    }
    const playerId = selectRandomPlayerFromVotes(votes)
    const channel = gameState.findTextChannelByRole(RoleIds.Seer) as TextChannel
    gameState.bodyGuardSelection = playerId

    const player = gameState.findPlayer(playerId)
    logger.info(`${RoleIds.BodyGuard} has protect ${player?.raw.displayName}`)
    await channel.send(`Bạn đã bảo vệ ${player?.raw.displayName}`)

    return new StartSeerTurn().handle()
  }
}

import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'

export class CheckBodyGuardSelection implements IStep {
  readonly __is_step = true
  constructor(
    private VotingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking Body guard selection')
    const votes = await collectVotes(this.VotingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')
      return new StartSeerTurn().handle()
    }
    const playerId = selectRandomPlayerFromVotes(votes)
    const channel = gameState.findTextChannelByRole(
      Role.BodyGuard
    ) as TextChannel
    gameState.bodyGuardSelection = playerId

    const player = gameState.findPlayer(playerId)
    logger.info(`${Role.BodyGuard} has protect ${player?.raw.displayName}`)
    await channel.send(`Bạn đã bảo vệ ${player?.raw.displayName}`)

    return new StartSeerTurn().handle()
  }
}

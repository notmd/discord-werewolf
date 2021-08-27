import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'

export class CheckSeerSelectionStep implements IStep {
  readonly __is_step = true

  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking Seer selection')
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')
      return new StartWereWolfTurn().handle()
    }
    const playerId = selectRandomPlayerFromVotes(votes)
    const channel = gameState.findTextChannelByRole(Role.Seer) as TextChannel
    const player = gameState.findPlayer(playerId)
    await channel.send(
      `${player?.raw.displayName} ${
        player?.role.id === Role.WereWolf || player?.role.id === Role.Lycan
          ? 'là sói.'
          : 'hem phải là sói.'
      }`
    )
    return new StartWereWolfTurn().handle()
  }
}

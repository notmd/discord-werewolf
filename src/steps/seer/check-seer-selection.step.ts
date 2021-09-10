import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role, WOLFS } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { logger } from '../../logger'
import { StartCupidTurn } from '../cupid/start-cupid-turn.step'
import { IStep } from '../step'

export class CheckSeerSelectionStep implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.Seer))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    // logger.info('Checking Seer selection')
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')

      return new StartCupidTurn().handle()
    }
    const playerId = selectRandomPlayerFromVotes(votes)
    const channel = gameState.findChannel(Role.Seer) as TextChannel
    const player = gameState.findPlayer(playerId)
    await channel.send(
      `${player?.raw.displayName} ${
        player?.role.in([...WOLFS, Role.Lycan]) ? 'là sói.' : 'hem phải là sói.'
      }`
    )

    return new StartCupidTurn().handle()
  }
}

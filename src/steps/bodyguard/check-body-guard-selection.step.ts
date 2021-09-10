import { Collection, Message, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes } from '../../helper'
import { logger } from '../../logger'
import { Player } from '../../player'
import { BodyGuard } from '../../roles/body-guard.role'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'

export class CheckBodyGuardSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.BodyGuard))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    // logger.info('Checking Body guard selection')
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')

      return new StartSeerTurn().handle()
    }

    const bodyGuard = gameState.findPlayerByRole(
      Role.BodyGuard
    ) as Player<BodyGuard>

    await bodyGuard.role.protect(votes)

    return new StartSeerTurn().handle()
  }
}

import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { Role } from '../../game-settings'
import { StartWitchTurn } from '../witch/start-witch-turn.step'
import { Collection, Message, Snowflake } from 'discord.js'

export class CheckWereWolfVotingResult implements IStep {
  readonly __is_step = true
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking werewolf voting results')
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const wolfs = gameState.findAllPlayersByRole(Role.WereWolf)
    wolfs.forEach((w) => {
      w.role.kill(playerId)
    })
    logger.info(
      `Were wolf kill ${gameState.findPlayer(playerId)?.raw.displayName}.`
    )
    return new StartWitchTurn().handle()
  }
}

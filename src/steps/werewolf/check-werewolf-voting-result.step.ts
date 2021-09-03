import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { Role } from '../../game-settings'
import { Collection, Message, Snowflake } from 'discord.js'
import { Player } from '../../player'
import { StartBlackWolfTurn } from '../blackwolf/start-blackwolf-turn.step'

export class CheckWereWolfVotingResult implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking werewolf voting results')
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId) as Player
    const wolfs = gameState.findAllPlayersByRole(Role.WereWolf)
    wolfs.forEach((w) => {
      player.onKill({
        by: w,
      })
    })
    logger.info(`Were wolf kill ${player.raw.displayName}.`)
    return new StartBlackWolfTurn().handle()
  }
}

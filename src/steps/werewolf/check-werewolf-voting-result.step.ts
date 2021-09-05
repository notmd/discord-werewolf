import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { Role, WOLFS } from '../../game-settings'
import { Collection, Message, Snowflake } from 'discord.js'
import { Player } from '../../player'
import { StartBlackWolfTurn } from '../blackwolf/start-blackwolf-turn.step'

export class CheckWereWolfVotingResult implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.in(WOLFS))
        .map((p) => p.raw.id)
    )
  }

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

    await gameState
      .findChannel(Role.WereWolf)
      ?.send(`Đã giết ${player.raw.displayName}.`)
    logger.info(`Were wolf kill ${player.raw.displayName}.`)
    return new StartBlackWolfTurn().handle()
  }
}

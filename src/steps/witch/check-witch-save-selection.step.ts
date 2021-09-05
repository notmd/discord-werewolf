import { Collection, Message, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { logger } from '../../logger'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'

export class CheckWitchSaveSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.Witch))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    logger.info('Checking Witch save selection.')

    const votes = await collectVotes(this.votingMessage, this.votingMap)

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)

    gameState.recentlyDeath.delete(playerId)
    gameState.deathPlayers.delete(playerId)
    gameState.witchUseSaved = true

    await gameState
      .findChannel(Role.Witch)
      ?.send(`Bạn đã cứu ${player?.raw.displayName}.`)

    return new WakeUp().handle()
  }
}

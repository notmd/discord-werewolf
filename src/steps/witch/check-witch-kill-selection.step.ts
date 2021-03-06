import { Collection, Message, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { Player } from '../../player'
import { StartOldHagTurn } from '../oldhag/start-old-hag-turn.step'
import { IStep } from '../step'

export class CheckWitchKillSelection implements IStep {
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
    // logger.info('Checking Witch kill selection.')
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      return new StartOldHagTurn().handle()
    }

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.players.find(
      (p) => p.raw.id === playerId
    ) as Player
    const witch = gameState.players.find(
      (p) => p.role.id === Role.Witch
    ) as Player
    player.onKill({
      by: witch,
    })
    gameState.recentlyDeath.add(playerId)
    gameState.witchUseKilled = true
    await gameState
      .findChannel(Role.Witch)
      ?.send(`Bạn đã giết ${player?.raw.displayName}.`)

    return new StartOldHagTurn().handle()
  }
}

import { Collection, Message, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { Player } from '../../player'
import { StartOldHagTurn } from '../oldhag/start-old-hag-turn.step'
import { IStep } from '../step'

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
    // logger.info('Checking Witch save selection.')

    const votes = await collectVotes(this.votingMessage, this.votingMap)

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)!
    CheckWitchSaveSelection.save(player)

    await gameState
      .findChannel(Role.Witch)
      ?.send(`Bạn đã cứu ${player?.raw.displayName}.`)

    return new StartOldHagTurn().handle()
  }

  static save(player: Player) {
    if (player.isCouple) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[...gameState.couple!.values()].forEach((playerId) => {
        gameState.recentlyDeath.delete(playerId)
        gameState.deathPlayers.delete(playerId)
      })
    }
    gameState.recentlyDeath.delete(player.raw.id)
    gameState.deathPlayers.delete(player.raw.id)

    gameState.witchUseSaved = true
  }
}

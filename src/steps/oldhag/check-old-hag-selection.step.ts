import { Message, Collection, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'

export class CheckOldHagSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}
  get allowedId() {
    return new Set([gameState.findPlayerByRole(Role.OldHag)!.raw.id])
  }
  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)

    gameState.oldHagSelection = playerId

    gameState
      .findChannel(Role.OldHag)
      ?.send(
        `Ok đã cho ${gameState.findPlayer(playerId)?.raw.displayName} bị câm.`
      )

    return new WakeUp().handle()
  }
}

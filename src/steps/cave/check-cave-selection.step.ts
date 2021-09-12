import { Message, Collection, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { StartBodyGuardTurn } from '../bodyguard/start-body-guard-turn.step'
import { IStep } from '../step'

export class CheckCaveSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}
  get allowedId() {
    return new Set([gameState.findPlayerByRole(Role.Cave)!.raw.id])
  }
  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)

    gameState.caveSelection = playerId

    gameState
      .findChannel(Role.Cave)
      ?.send(
        `Ok đã cho ${gameState.findPlayer(playerId)?.raw.displayName} bị yếu.`
      )

    return new StartBodyGuardTurn().handle()
  }
}

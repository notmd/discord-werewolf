import { Collection, Message } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { StartOldHagTurn } from '../oldhag/start-old-hag-turn.step'
import { IStep } from '../step'
import { CheckWitchSaveSelection } from './check-witch-save-selection.step'
import { DisplayWitchKillSelection } from './display-witch-kill-selection.step'
import { DisplayWitchSaveSelection } from './display-witch-save-selection.step'

export class CheckWitchSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, 'skip' | 'kill' | 'save'>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.Witch))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap, {})
    const action = selectRandomPlayerFromVotes(votes)

    if (action === undefined || action === 'skip') {
      // logger.warn('Witch choose skip.')
      gameState.findChannel(Role.Witch)?.send(`Ok skip.`)

      return new StartOldHagTurn().handle()
    } else if (action === 'kill') {
      return new DisplayWitchKillSelection().handle()
    } else if (action === 'save') {
      if (gameState.recentlyDeath.size === 1) {
        const playerId = gameState.recentlyDeath.values().next().value as string

        const player = gameState.findPlayer(playerId)!
        CheckWitchSaveSelection.save(player)
        await gameState
          .findChannel(Role.Witch)
          ?.send(`Bạn đã cứu ${player.raw.displayName}.`)

        return new StartOldHagTurn().handle()
      }

      return new DisplayWitchSaveSelection().handle()
    }

    return
  }
}

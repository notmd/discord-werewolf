import { Collection, Message } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
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
      logger.warn('Witch choose skip.')
      return new WakeUp().handle()
    } else if (action === 'kill') {
      return new DisplayWitchKillSelection().handle()
    } else if (action === 'save') {
      if (gameState.lastRoundActualDeath.size === 1) {
        const playerId = gameState.lastRoundActualDeath.values().next()
          .value as string
        gameState.lastRoundActualDeath.delete(playerId)
        gameState.deathPlayers.delete(playerId)
        gameState.witchUseSaved = true

        const player = gameState.findPlayer(playerId)
        await gameState
          .findTextChannelByRole(Role.Witch)
          ?.send(`Bạn đã cứu ${player?.raw.displayName}.`)
        return new WakeUp()
      }
      return new DisplayWitchSaveSelection().handle()
    }

    return
  }
}

import { Collection, Message } from 'discord.js'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { DisplayWitchKillSelection } from './display-witch-kill-selection.step'
import { DisplayWitchSaveSelection } from './display-witch-save-selection.step'

export class CheckWitchSelection implements IStep {
  readonly __is_step = true
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, 'skip' | 'kill' | 'save'>
  ) {}
  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap, {})
    const action = selectRandomPlayerFromVotes(votes)

    if (action === undefined || action === 'skip') {
      logger.warn('Witch choose skip.')
      return new WakeUp().handle()
    } else if (action === 'kill') {
      return new DisplayWitchKillSelection().handle()
    } else if (action === 'save') {
      return new DisplayWitchSaveSelection().handle()
    }

    return null
  }
}

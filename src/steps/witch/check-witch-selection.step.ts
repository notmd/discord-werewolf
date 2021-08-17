import { Collection, Message } from 'discord.js'
import { gameState } from '../../game-state'
import { selectRandomPlayerFromVotes } from '../../hepler'
import { Thumbsup } from '../../icons'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { DisplayWitchKillSelection } from './display-witch-kill-selection.step'
import { DisplayWitchSaveSelection } from './display-witch-save-selection.step'

export class CheckWitchSelection implements IStep {
  readonly __is_step = true

  async handle() {
    const messages = Array.from(gameState.witchSelectionMessages.values())
    const votes = await this.getVotes(messages)
    const messageId = selectRandomPlayerFromVotes(votes)
    const action = gameState.witchSelectionMessages.findKey(
      (m) => m.id === messageId
    )
    if (action === undefined || action === 'skip') {
      return new WakeUp().handle()
    } else if (action === 'kill') {
      return new DisplayWitchKillSelection().handle()
    } else if (action === 'save') {
      return new DisplayWitchSaveSelection().handle()
    }

    return null
  }

  private async getVotes(messages: Message[]) {
    const votes: Collection<string, number> = new Collection()
    for (const message of messages) {
      const fetched = await message.fetch(true)
      const thumbsupReaction = fetched.reactions.cache
        .filter((r) => r.emoji.name === Thumbsup)
        .first()
      if (thumbsupReaction) {
        const alivePlayers = gameState.alivePlayers
        const invalidReactionCount = thumbsupReaction.users.cache.filter(
          (u) => !alivePlayers.some((p) => p.raw.id === u.id)
        ).size
        votes.set(message.id, thumbsupReaction.count - invalidReactionCount)
      }
    }
    return votes
  }
}

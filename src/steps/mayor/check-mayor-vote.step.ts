import { Collection, Message } from 'discord.js'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { Letter } from '../../types'
import { StartDisscusion } from '../start-discussion.step'
import { StartSleep } from '../start-sleep.step'
import { IStep } from '../step'

export class CheckMayorVote implements IStep {
  readonly __is_step = true

  constructor(
    private message: Message,
    private votingMap: Collection<Letter, string>,
    private shouldStartDiscussion: boolean
  ) {}

  async handle() {
    const votes = await collectVotes(this.message, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)
    await gameState.otherTextChannels
      .get('main')
      ?.send(
        gameState.mayorId
          ? `Trưởng Làng đã được trao lại cho ${player?.raw}.`
          : `${player?.raw} đã được bầu làm Trưởng Làng.`
      )
    gameState.mayorId = playerId

    if (this.shouldStartDiscussion) {
      return new StartDisscusion().handle()
    }

    return new StartSleep().handle()
  }
}

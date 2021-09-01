import {
  checkWin,
  collectVotes,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVictoryAnnoucement,
  unmuteEveryone,
} from '../../hepler'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { StartSleep } from '../start-sleep.step'
import { Role } from '../../game-settings'
import { StartDisscusion } from '../start-discussion.step'
import { Collection, Message, Snowflake } from 'discord.js'
import { StartMayorVote } from '../mayor/start-vote-mayor.step'
import { Player } from '../../player'

export class CheckHunterSelection implements IStep {
  readonly __is_step = true
  constructor(
    private shouldStartDiscussion: boolean,
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking hunter selection.')

    const hunter = gameState.findPlayerByRole(Role.Hunter) as Player
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)
    player?.onKill({ by: hunter })
    await gameState.otherTextChannels
      .get('main')
      ?.send(`${player?.raw} đã bị ${hunter?.role.name} bắn chết.`)
    await muteAllDeathPlayer()

    if (checkWin()) {
      await sendVictoryAnnoucement()
      await unmuteEveryone()
      return null
    }

    if (
      !gameState.mayorId ||
      gameState.lastRoundActualDeath.has(gameState.mayorId)
    ) {
      return new StartMayorVote(this.shouldStartDiscussion).handle()
    }

    if (this.shouldStartDiscussion) {
      return new StartDisscusion().handle()
    }

    return new StartSleep().handle()
  }
}

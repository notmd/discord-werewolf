import {
  checkVillagerWin,
  checkWereWolfWin,
  collectVotes,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVillagerWinMessage,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../../hepler'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { StartSleep } from '../start-sleep.step'
import { Role } from '../../game-settings'
import { StartDisscusion } from '../start-discussion.step'
import { Collection, Message, Snowflake } from 'discord.js'

export class CheckHunterSelection implements IStep {
  readonly __is_step = true
  constructor(
    private shouldStartDiscussion: boolean,
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    logger.info('Checking hunter selection.')

    const hunter = gameState.findPlayerByRole(Role.Hunter)

    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)
    hunter?.role.kill(playerId)
    gameState.otherTextChannels
      .get('main')
      ?.send(`${player?.raw} đã bị ${hunter?.role.name} bắn chết.`)

    await muteAllDeathPlayer()

    if (checkWereWolfWin()) {
      await sendWereWolfWinMessage()
      await unmuteEveryone()
      return null
    }
    if (checkVillagerWin()) {
      await sendVillagerWinMessage()
      return null
    }

    if (this.shouldStartDiscussion) {
      return new StartDisscusion().handle()
    }

    return new StartSleep().handle()
  }
}
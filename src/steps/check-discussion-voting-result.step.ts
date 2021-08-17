import { TextChannel } from 'discord.js'
import {
  checkVillagerWin,
  checkWereWolfWin,
  getVotesFromMessages,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVillagerWinMessage,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { IStep } from './step'
import { logger } from '../logger'
import { StartSleep } from './start-sleep.step'

export class CheckDiscussionVotingResult implements IStep {
  readonly __is_step = true
  private mainTextChannel: TextChannel
  constructor() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    if (!mainTextChannel) {
      throw new Error('cannot find main text channel.')
    }
    this.mainTextChannel = mainTextChannel
  }

  async handle() {
    logger.info('Checking discussion voting result.')
    const votingMessages = gameState.discussionVotingMessages

    const votes = await getVotesFromMessages(votingMessages)
    if (votes.size === 0) {
      await this.sendNoOneVotedNotification()
    } else {
      const votedPlayerId = selectRandomPlayerFromVotes(votes)
      gameState.markPlayerAsDeath(votedPlayerId, {
        ignoreLastRoundActualDeath: true,
      })
      await muteAllDeathPlayer()
      await this.sendVotedUserNotification(votedPlayerId)
    }
    if (checkWereWolfWin()) {
      await sendWereWolfWinMessage()
      await unmuteEveryone()
      return null
    }
    if (checkVillagerWin()) {
      await sendVillagerWinMessage()
      return null
    }

    return new StartSleep().handle()
  }

  async sendNoOneVotedNotification() {
    await this.mainTextChannel.send(`Hum nay khum ai chết cả.\n`)
  }

  async sendVotedUserNotification(deathPlayerId: string) {
    await this.mainTextChannel.send(
      `${
        gameState.findPlayer(deathPlayerId)?.raw
      } đã bị chết như 1 con cho rach.`
    )
  }
}

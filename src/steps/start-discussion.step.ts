import { TextChannel } from 'discord.js'
import {
  checkWereWolfWin,
  muteAllDeathPlayer,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { Thumbsup } from '../icons'
import { IStep } from './step'
import { CheckDiscussionVotingResult } from './check-discussion-voting-result.step'

export class StartDisscusion implements IStep {
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
    if (checkWereWolfWin()) {
      await sendWereWolfWinMessage()
      await unmuteEveryone()
      return null
    }
    await muteAllDeathPlayer()
    await this.sendVoteResultMessage()
    return new CheckDiscussionVotingResult()
  }

  async sendVoteResultMessage() {
    await this.mainTextChannel.send(`Chọn ${Thumbsup} để vote.`)

    const alivePlayers = gameState.alivePlayers
    for (const alivePlayer of alivePlayers) {
      const message = await this.mainTextChannel.send(`${alivePlayer.raw}`)
      gameState.addDiscussionVotingMessage(message)
    }
  }
}

import { TextChannel } from 'discord.js'
import {
  checkWereWolfWin,
  muteAllDeathPlayer,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { Thumbsup } from '../icons'
import { ITurn } from './turn'
import { CheckDiscussionVotingResult } from './check-discussion-voting-result.turn'

export class StartDisscusion implements ITurn {
  readonly __is_turn = true
  private mainTextChannel: TextChannel
  private deathPlayerMeation: string
  constructor() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    if (!mainTextChannel) {
      throw new Error('cannot find main text channel.')
    }
    this.mainTextChannel = mainTextChannel
    this.deathPlayerMeation = Array.from(
      gameState.lastRoundActualDeath.values()
    )
      .map((playerId) => {
        return gameState.findPlayer(playerId)?.raw
      })
      .join(', ')
  }

  async handle() {
    if (checkWereWolfWin()) {
      await this.mainTextChannel.send(
        `Đêm qua ${this.deathPlayerMeation} đã chết.\n`
      )
      await sendWereWolfWinMessage()
      await unmuteEveryone()
      return null
    }
    await muteAllDeathPlayer()
    await this.sendVoteResultMessage()
    gameState.clearLastRoundAcctualDeath()
    return new CheckDiscussionVotingResult()
  }

  async sendVoteResultMessage() {
    if (gameState.lastRoundActualDeath.size > 0) {
      await this.mainTextChannel.send(
        `Đêm qua ${this.deathPlayerMeation} đã chết.\nChọn ${Thumbsup} để vote.`
      )
    } else {
      this.mainTextChannel.send(
        `Dậy nào các bạn êi.\nĐêm qua hem ai chết cả.\nChọn ${Thumbsup} để vote.`
      )
    }
    const alivePlayers = gameState.alivePlayers
    for (const alivePlayer of alivePlayers) {
      const message = await this.mainTextChannel.send(`${alivePlayer.raw}`)
      gameState.addDiscussionVotingMessage(message)
    }
  }
}

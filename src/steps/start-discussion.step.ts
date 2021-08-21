import { TextChannel } from 'discord.js'
import {
  checkVillagerWin,
  checkWereWolfWin,
  createVotingMessage,
  muteAllDeathPlayer,
  sendVillagerWinMessage,
  sendVotingMessage,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
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
    if (checkVillagerWin()) {
      await sendVillagerWinMessage()
      await unmuteEveryone()
      return null
    }
    await muteAllDeathPlayer()
    const { embed, map } = createVotingMessage(gameState.alivePlayers)
    // embed.setTitle('Dậy đi nào mấy con sói già. Mấy con sói già muốn giết ai?')
    const message = await sendVotingMessage(this.mainTextChannel, embed, map)
    return new CheckDiscussionVotingResult(message, map)
  }
}

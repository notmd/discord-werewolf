import { TextChannel } from 'discord.js'
import {
  checkWin,
  createVotingMessage,
  muteAllDeathPlayer,
  sendVictoryAnnoucement,
  sendVotingMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { IStep } from './step'
import { CheckDiscussionVotingResult } from './check-discussion-voting-result.step'

export class StartDisscusion implements IStep {
  private mainTextChannel: TextChannel
  constructor() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    if (!mainTextChannel) {
      throw new Error('cannot find main text channel.')
    }
    this.mainTextChannel = mainTextChannel
  }

  async handle() {
    if (checkWin()) {
      await sendVictoryAnnoucement()
      await unmuteEveryone()
      return
    }
    await muteAllDeathPlayer()
    const { embed, map } = createVotingMessage<'skip' | string>([
      { id: 'skip', text: 'Skip ⏩' },
      ...gameState.alivePlayers,
    ])
    embed.setTitle('Vote giet nguoi đi các bạn ei')
    const message = await sendVotingMessage(this.mainTextChannel, embed, map)
    await message.pin()
    return new CheckDiscussionVotingResult(message, map)
  }
}

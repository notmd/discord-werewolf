import { TextChannel } from 'discord.js'
import {
  checkVillagerWin,
  checkWereWolfWin,
  checkWin,
  getVotesFromMessages,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVillagerWinMessage,
  sendWereWolfWinMessage,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { ITurn } from './turn'
import { StartWereWolfTurn } from './werewolf/start-werewolf-voting.turn'

export class CheckDiscussionVotingResult implements ITurn {
  readonly __is_turn = true
  private mainTextChannel: TextChannel
  constructor() {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    if (!mainTextChannel) {
      throw new Error('cannot find main text channel.')
    }
    this.mainTextChannel = mainTextChannel
  }

  async handle() {
    const votingMessages = gameState.discussionVotingMessages
    console.log(votingMessages)
    const votes = await getVotesFromMessages(votingMessages)
    if (votes.size === 0) {
      await this.sendNoOneVotedNotification()
    } else {
      const votedPlayerId = selectRandomPlayerFromVotes(votes)
      gameState.markPlayerAsDeath(votedPlayerId)
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
    gameState.clearVotingMessages('discussion')

    return new StartWereWolfTurn().handle()
  }

  async sendNoOneVotedNotification() {
    await this.mainTextChannel.send(
      `Hum nay khum ai chết cả.\nĐi ngủ thui nào các pạn.`
    )
  }

  async sendVotedUserNotification(deathPlayerId: string) {
    await this.mainTextChannel.send(
      `${
        gameState.findPlayer(deathPlayerId)?.raw
      } đã bị chết như 1 con cho rach.\n${
        !checkWin() && 'Đi ngủ thui nào các pạn.'
      }`
    )
  }
}

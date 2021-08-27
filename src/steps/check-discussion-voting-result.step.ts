import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import {
  checkVillagerWin,
  checkWereWolfWin,
  collectVotes,
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
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { Role } from '../game-settings'

export class CheckDiscussionVotingResult implements IStep {
  readonly __is_step = true
  private mainTextChannel: TextChannel
  constructor(
    private VotingMessage: Message,
    private votingMap: Collection<string, 'skip' | Snowflake>
  ) {
    const mainTextChannel = gameState.otherTextChannels.get('main')
    if (!mainTextChannel) {
      throw new Error('cannot find main text channel.')
    }
    this.mainTextChannel = mainTextChannel
  }

  async handle() {
    logger.info('Checking discussion voting result.')

    const votes = await collectVotes(this.VotingMessage, this.votingMap, {
      onlyPositive: true,
    })

    if (votes.size === 0) {
      await this.sendNoOneVotedNotification()
      return new StartSleep().handle()
    }

    const votedPlayerId = selectRandomPlayerFromVotes(votes)

    if (votedPlayerId === 'skip') {
      await this.sendNoOneVotedNotification()
      return new StartSleep().handle()
    }

    gameState.markPlayerAsDeath(votedPlayerId, {
      ignoreLastRoundActualDeath: true,
      ignoreLastRounDeath: true,
    })
    await this.sendVotedUserNotification(votedPlayerId)

    if (checkWereWolfWin()) {
      await sendWereWolfWinMessage()
      await unmuteEveryone()
      return null
    }
    if (checkVillagerWin()) {
      await sendVillagerWinMessage()
      return null
    }

    if (votedPlayerId === gameState.findPlayerByRole(Role.Hunter)?.raw.id) {
      return new StartHunterTurn(false).handle()
    }

    await muteAllDeathPlayer()

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

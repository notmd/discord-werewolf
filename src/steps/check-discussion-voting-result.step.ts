import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import {
  checkWin,
  collectVotes,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVictoryAnnoucement,
  unmuteEveryone,
} from '../hepler'
import { gameState } from '../game-state'
import { IStep } from './step'
import { logger } from '../logger'
import { StartSleep } from './start-sleep.step'
import { StartHunterTurn } from './hunter/start-hunter-turn.step'
import { Role } from '../game-settings'
import { StartMayorVote } from './mayor/start-vote-mayor.step'
import { Player } from '../player'

export class CheckDiscussionVotingResult implements IStep {
  private mainTextChannel: TextChannel
  constructor(
    private votingMessage: Message,
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

    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
      withMayorVote: true,
    })

    if (votes.size === 0) {
      await this.sendNoOneVotedNotification()
      return new StartSleep().handle()
    }

    const votedPlayerId = selectRandomPlayerFromVotes(votes)

    if (votedPlayerId === 'skip') {
      logger.info(`Skip with ${votes.get('skip')} vote`)
      await this.sendNoOneVotedNotification()
      return new StartSleep().handle()
    }

    const votedPlayer = gameState.findPlayer(votedPlayerId) as Player
    votedPlayer.onKill({ by: 'everyone' })

    await this.mainTextChannel.send(
      `${gameState.players
        .filter((p) => gameState.lastRoundActualDeath.has(p.raw.id))
        .map((p) => p.raw)
        .join(', ')} đã bị chết như 1 con cho rach.`
    )

    if (checkWin()) {
      await sendVictoryAnnoucement()
      await unmuteEveryone()
      return
    }

    await this.votingMessage.unpin()

    if (votedPlayer.role.is(Role.Hunter)) {
      return new StartHunterTurn(false).handle()
    }

    await muteAllDeathPlayer()

    if (
      !gameState.mayorId ||
      gameState.lastRoundActualDeath.has(gameState.mayorId)
    ) {
      return new StartMayorVote(false).handle()
    }

    return new StartSleep().handle()
  }

  async sendNoOneVotedNotification() {
    await this.mainTextChannel.send(`Hum nay khum ai chết cả.\n`)
  }
}

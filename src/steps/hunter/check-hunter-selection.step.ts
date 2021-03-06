import {
  checkWin,
  collectVotes,
  muteAllDeathPlayer,
  selectRandomPlayerFromVotes,
  sendVictoryAnnoucement,
  shouldStartMayorVoting,
  unmuteEveryone,
} from '../../helper'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { StartSleep } from '../start-sleep.step'
import { Role } from '../../game-settings'
import { StartDisscusion } from '../start-discussion.step'
import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { StartMayorVote } from '../mayor/start-vote-mayor.step'

export class CheckHunterSelection implements IStep {
  constructor(
    private shouldStartDiscussion: boolean,
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.Hunter))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    logger.info('Checking hunter selection.')

    const hunter = gameState.findPlayerByRole(Role.Hunter)!
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId)!

    const deathPlayers = player.onKill({ by: hunter })
    if (playerId !== hunter.raw.id) {
      hunter.onKill({ by: hunter })
    }

    const mainTextChannel = gameState.otherTextChannels.get(
      'main'
    ) as TextChannel
    await mainTextChannel.send(
      `${player?.raw} đã bị ${hunter?.role.name} bắn chết.`
    )

    const otherDeathUsers = deathPlayers.filter((p) => p.raw.id !== playerId)
    if (otherDeathUsers.length > 0) {
      await mainTextChannel.send(`${otherDeathUsers.join(', ')} đã chết.`)
    }

    await muteAllDeathPlayer()

    if (checkWin()) {
      await sendVictoryAnnoucement()
      await unmuteEveryone()

      return
    }

    if (shouldStartMayorVoting()) {
      return new StartMayorVote(this.shouldStartDiscussion).handle()
    }

    if (this.shouldStartDiscussion) {
      return new StartDisscusion().handle()
    }

    return new StartSleep().handle()
  }
}

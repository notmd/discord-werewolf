import { Collection, Message, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { Player } from '../../player'
import { StartDisscusion } from '../start-discussion.step'
import { StartSleep } from '../start-sleep.step'
import { IStep } from '../step'

export class CheckMayorVote implements IStep {
  constructor(
    private message: Message,
    private votingMap: Collection<string, string>,
    private shouldStartDiscussion: boolean
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.raw.id === gameState.mayorId)
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    const votes = await collectVotes(this.message, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.findPlayer(playerId) as Player
    await gameState.otherTextChannels
      .get('main')
      ?.send(
        gameState.mayorId
          ? `Trưởng Làng đã được trao lại cho ${player?.raw}.`
          : `${player?.raw} đã được bầu làm Trưởng Làng.`
      )
    const oldMayor = gameState.mayorId
    gameState.mayorId = playerId

    const channel = gameState.findChannel(Role.Mayor) as TextChannel
    if (oldMayor) {
      await channel.permissionOverwrites.delete(oldMayor)
    }
    await channel.permissionOverwrites.create(player.raw.id, {
      VIEW_CHANNEL: true,
      ADD_REACTIONS: true,
      SEND_MESSAGES: true,
    })

    if (this.shouldStartDiscussion) {
      return new StartDisscusion().handle()
    }

    return new StartSleep().handle()
  }
}

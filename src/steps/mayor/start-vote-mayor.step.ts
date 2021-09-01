import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  checkWin,
  createVotingMessage,
  sendVictoryAnnoucement,
  sendVotingMessage,
  unmuteEveryone,
} from '../../hepler'
import { IStep } from '../step'
import { CheckMayorVote } from './check-mayor-vote.step'

export class StartMayorVote implements IStep {
  readonly __is_step = true

  constructor(private shouldStartDiscussion: boolean) {}

  async handle() {
    if (checkWin()) {
      await sendVictoryAnnoucement()
      await unmuteEveryone()
      return null
    }
    const { embed, map } = createVotingMessage(
      gameState.mayorId
        ? gameState.alivePlayers.filter(
            (player) => player.raw.id !== gameState.mayorId
          )
        : gameState.alivePlayers
    )
    if (gameState.mayorId) {
      embed.setTitle('Bạn muốn trao lại Trưởng Làng cho ai?')
      await gameState.otherTextChannels
        .get('main')
        ?.send(`Đang trao lại trưởng làng.`)
    } else {
      embed.setTitle(`Bầu Trưởng Làng đi các pạn.`)
    }

    const channel = gameState.mayorId
      ? gameState.findTextChannelByRole(Role.Mayor)
      : gameState.otherTextChannels.get('main')
    const message = await sendVotingMessage(channel as TextChannel, embed, map)

    return new CheckMayorVote(message, map, this.shouldStartDiscussion)
  }
}

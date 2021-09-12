import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { IStep } from '../step'
import { CheckWitchSaveSelection } from './check-witch-save-selection.step'

export class DisplayWitchSaveSelection implements IStep {
  async handle() {
    const channel = gameState.findChannel(Role.Witch) as TextChannel

    const saveablePlayers = gameState.players.filter((p) =>
      gameState.deathPlayerReportToWitch.has(p.raw.id)
    )

    const { embed, map } = createVotingMessage(saveablePlayers)
    embed.setTitle('Phù thủy mún cứu ai?')
    const message = await sendVotingMessage(channel, { embeds: [embed] }, map)

    return new CheckWitchSaveSelection(message, map)
  }
}

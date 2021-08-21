import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { IStep } from '../step'
import { CheckWitchSaveSelection } from './check-witch-save-selection.step'

export class DisplayWitchSaveSelection implements IStep {
  readonly __is_step = true

  async handle() {
    const channel = gameState.findTextChannelByRole(Role.Witch) as TextChannel

    const saveablePlayers = gameState.players.filter((p) =>
      gameState.lastRoundDeath.has(p.raw.id)
    )

    const { embed, map } = createVotingMessage(saveablePlayers)
    embed.setTitle('Phù thủy mún cứu ai?')
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckWitchSaveSelection(message, map)
  }
}

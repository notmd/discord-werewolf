import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { IStep } from '../step'
import { CheckWitchKillSelection } from './check-witch-kill-selection.step'

export class DisplayWitchKillSelection implements IStep {
  readonly __is_step = true

  async handle() {
    const channel = gameState.findTextChannelByRole(Role.Witch) as TextChannel

    const killablePlayers = gameState.alivePlayers.filter(
      (p) => !gameState.lastRoundDeath.has(p.raw.id) && p.role.id !== Role.Witch
    )

    const { embed, map } = createVotingMessage(killablePlayers)
    embed.setTitle('Phù thủy mún giết ai?')
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckWitchKillSelection(message, map)
  }
}

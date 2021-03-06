import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { IStep } from '../step'
import { CheckWitchKillSelection } from './check-witch-kill-selection.step'

export class DisplayWitchKillSelection implements IStep {
  async handle() {
    logger.info('Start Witch kill selection.')
    const channel = gameState.findChannel(Role.Witch) as TextChannel

    const killablePlayers = gameState.alivePlayers.filter(
      (p) =>
        !gameState.deathPlayerReportToWitch.has(p.raw.id) &&
        p.role.id !== Role.Witch
    )

    const { embed, map } = createVotingMessage(killablePlayers)
    embed.setTitle('Phù thủy mún giết ai?')
    const message = await sendVotingMessage(
      channel,
      { embeds: [embed] },
      map
      // gameState.findPlayerByRole(Role.Witch)?.raw.toString()
    )

    return new CheckWitchKillSelection(message, map)
  }
}

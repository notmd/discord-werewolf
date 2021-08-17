import { TextChannel } from 'discord.js'
import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { IStep } from '../step'
import { CheckWitchKillSelection } from './check-witch-kill-selection.step'

export class DisplayWitchKillSelection implements IStep {
  readonly __is_step = true

  async handle() {
    const channel = gameState.findTextChannelByRole(
      RoleIds.Witch
    ) as TextChannel

    const killablePlayers = gameState.alivePlayers.filter(
      (p) => !gameState.lastRoundDeath.has(p.raw.id)
    )

    await channel.send(`Chọn ${Thumbsup} để giết.`)
    for (const player of killablePlayers) {
      const m = await channel.send(player.raw.toString())
      gameState.witchKillSelectionMessages.push(m)
    }

    return new CheckWitchKillSelection()
  }
}
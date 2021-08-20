import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { IStep } from '../step'
import { CheckWitchSaveSelection } from './check-witch-save-selection.step'

export class DisplayWitchSaveSelection implements IStep {
  readonly __is_step = true

  async handle() {
    const channel = gameState.findTextChannelByRole(Role.Witch) as TextChannel

    const saveablePlayers = gameState.players.filter((p) =>
      gameState.lastRoundDeath.has(p.raw.id)
    )

    await channel.send(`Chọn ${Thumbsup} để cứu.`)
    for (const player of saveablePlayers) {
      const m = await channel.send(player.raw.toString())
      gameState.witchSaveSelectionMessages.push(m)
    }

    return new CheckWitchSaveSelection()
  }
}

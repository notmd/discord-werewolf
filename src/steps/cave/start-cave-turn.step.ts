import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { nextMessage } from '../../utils'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { CheckCaveSelection } from './check-cave-selection.step'

export class StartCaveTurn implements IStep {
  async handle() {
    if (!gameState.hasRole(Role.OldHag)) {
      return new WakeUp().handle()
    }

    const cave = gameState.findPlayer(Role.Cave)!

    const players = gameState.alivePlayers.filter(
      (p) => p.raw.id != gameState.lastCaveSelectio
    )
    const { embed, map } = createVotingMessage(players)
    embed.setTitle('Dậy đi cave. Bạn mún ai bị yếu?')
    const message = await sendVotingMessage(
      cave.role.channel,
      embed,
      map,
      `${cave}. ${nextMessage}`
    )

    return new CheckCaveSelection(message, map)
  }
}

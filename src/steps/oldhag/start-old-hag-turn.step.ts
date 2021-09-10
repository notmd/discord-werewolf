import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { CheckOldHagSelection } from './check-old-hag-selection.step'

export class StartOldHagTurn implements IStep {
  async handle() {
    if (!gameState.hasRole(Role.OldHag)) {
      return new WakeUp().handle()
    }

    const oldHag = gameState.findPlayer(Role.OldHag)!

    const players = gameState.alivePlayers.filter(
      (p) => p.raw.id != gameState.lastOlHagSelection
    )
    const { embed, map } = createVotingMessage(players)
    embed.setTitle('Dậy đi phù thủy già. Bạn mún ai bị câm?')
    const message = await sendVotingMessage(
      oldHag.role.channel,
      embed,
      map,
      oldHag.toString()
    )

    return new CheckOldHagSelection(message, map)
  }
}

import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  createVotingMessage,
  fakeDelay,
  sendCannotUseAbilityReason,
  sendVotingMessage,
} from '../../helper'
import { logger } from '../../logger'
import { StartBodyGuardTurn } from '../bodyguard/start-body-guard-turn.step'
import { IStep } from '../step'
import { CheckCaveSelection } from './check-cave-selection.step'

export class StartCaveTurn implements IStep {
  async handle() {
    if (!gameState.hasRole(Role.Cave)) {
      return new StartBodyGuardTurn().handle()
    }

    logger.info(`Start Cave turn.`)

    const cave = gameState.findPlayerByRole(Role.Cave)!

    if (!cave.canUseAbility) {
      await sendCannotUseAbilityReason(cave)
      await fakeDelay()

      return new StartBodyGuardTurn().handle()
    }

    const players = gameState.alivePlayers.filter(
      (p) => p.raw.id != gameState.lastCaveSelection
    )
    const { embed, map } = createVotingMessage(players, {
      title: 'Dậy đi cave. Bạn mún ai bị yếu?',
    })
    const message = await sendVotingMessage(
      cave.role.channel,
      { embeds: [embed], content: `${cave}.` },
      map
    )

    return new CheckCaveSelection(message, map)
  }
}

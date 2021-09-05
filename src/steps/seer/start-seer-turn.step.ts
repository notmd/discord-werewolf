import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { Seer } from '../../roles/seer.role'
import { rand, sleep } from '../../utils'
import { StartCupidTurn } from '../cupid/start-cupid-turn.step'
import { IStep } from '../step'
import { CheckSeerSelectionStep } from './check-seer-selection.step'

export class StartSeerTurn implements IStep {
  async handle() {
    logger.info('Start seer turn.')
    if (!gameState.hasRole(Role.Seer)) {
      logger.warn('Game does not has Seer role. Skip...')
      return new StartCupidTurn().handle()
    }
    const seer = gameState.findPlayerByRole<Seer>(Role.Seer)

    if (!seer || !seer.canUseAbility) {
      const seconds = rand(20, 30)
      logger.warn(`Seer cant use ability. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)
      return new StartCupidTurn().handle()
    }

    const alivePlayers = gameState.alivePlayers.filter(
      (p) => p.role.id !== Role.Seer
    )
    const { embed, map } = createVotingMessage(alivePlayers)
    embed.setTitle('Dậy đi nào Tiên tri ei. Bạn mún tiên tri ai?')
    const message = await sendVotingMessage(seer.role.channel, embed, map)

    logger.info('Waiting Seer selection.')
    return new CheckSeerSelectionStep(message, map)
  }
}

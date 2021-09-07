import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { logger } from '../../logger'
import { BodyGuard } from '../../roles/body-guard.role'
import { rand, sleep } from '../../utils'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'
import { CheckBodyGuardSelection } from './check-body-guard-selection.step'

export class StartBodyGuardTurn implements IStep {
  async handle(): Promise<any> {
    logger.info(`Start ${Role.BodyGuard} turn.`)

    if (!gameState.hasRole(Role.BodyGuard)) {
      logger.warn(`Game does not has ${Role.BodyGuard} role. Skip...`)

      return new StartSeerTurn().handle()
    }

    const bodyGuard = gameState.findPlayerByRole<BodyGuard>(Role.BodyGuard)

    if (!bodyGuard || !bodyGuard.canUseAbility) {
      const seconds = rand(20, 30)
      logger.warn(`Bodyguard cant use ability. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)

      return new StartSeerTurn().handle()
    }

    const { map, message } = await bodyGuard.role.displayProtectablePlayers()

    return new CheckBodyGuardSelection(message, map)
  }
}

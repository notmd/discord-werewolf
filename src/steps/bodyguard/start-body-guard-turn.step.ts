import { TextChannel } from 'discord.js'
import { gameSettings, RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { logger } from '../../logger'
import { CheckSeerSelectionStep } from '../seer/check-seer-selection.step'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'

export class StartBodyGuardTurn implements IStep {
  readonly __is_step = true

  async handle() {
    logger.info(
      `Start ${gameSettings.roles.get(RoleIds.BodyGuard)?.name} turn.`
    )
    if (gameState.findAllPlayersByRole(RoleIds.BodyGuard).length === 0) {
      logger.warn(`Game does not has ${RoleIds.BodyGuard} role. Skip...`)
      return new StartSeerTurn().handle()
    }
    if (!gameState.findPlayByRole(RoleIds.BodyGuard)?.isDeath) {
      logger.warn(`${RoleIds.BodyGuard} was death. Skip...`)
      return new StartSeerTurn().handle()
    }

    const alivePlayers = gameState.alivePlayers
    const protectablePlayers = alivePlayers.filter(
      (p) => p.raw.id !== gameState.bodyGuardLastSelection
    )
    const channel = gameState.findTextChannelByRole(
      RoleIds.BodyGuard
    ) as TextChannel
    channel.send(`Bạn mún bảo vệ ai? Chọn ${Thumbsup}`)
    for (const player of protectablePlayers) {
      const message = await channel.send(`${player.raw}`)
      gameState.bodyGuardSelectionMessages.push(message)
    }

    return new CheckSeerSelectionStep()
  }
}

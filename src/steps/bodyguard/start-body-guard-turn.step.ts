import { TextChannel } from 'discord.js'
import { gameSettings, Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { logger } from '../../logger'
import { CheckSeerSelectionStep } from '../seer/check-seer-selection.step'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'

export class StartBodyGuardTurn implements IStep {
  readonly __is_step = true

  async handle(): Promise<any> {
    const bodyGuard = gameState.players.find((p) => p.role.is(Role.BodyGuard))
    logger.info(`Start ${gameSettings.roles.get(Role.BodyGuard)?.name} turn.`)
    if (!bodyGuard) {
      logger.warn(`Game does not has ${Role.BodyGuard} role. Skip...`)
      return new StartSeerTurn().handle()
    }

    if (bodyGuard.isDeath) {
      logger.warn(`${bodyGuard.role.name} was death. Skip...`)
      return new StartSeerTurn().handle()
    }

    const alivePlayers = gameState.alivePlayers
    const protectablePlayers = alivePlayers.filter(
      (p) => p.raw.id !== gameState.bodyGuardLastSelection
    )
    const channel = gameState.findTextChannelByRole(
      Role.BodyGuard
    ) as TextChannel
    channel.send(`Dậy đi nào bảo vệ ei.\nBạn mún bảo vệ ai? Chọn ${Thumbsup}`)
    for (const player of protectablePlayers) {
      const message = await channel.send(`${player.raw}`)
      gameState.bodyGuardSelectionMessages.push(message)
    }

    return new CheckSeerSelectionStep()
  }
}

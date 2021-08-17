import { TextChannel } from 'discord.js'
import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { logger } from '../../logger'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { CheckWitchSelection } from './check-witch-selection.step'

export class StartBodyGuardTurn implements IStep {
  readonly __is_step = true

  async handle() {
    const witch = gameState.players.find((p) => p.role.is(RoleIds.Witch))
    logger.info(`Start Witch turn.`)
    if (!witch) {
      logger.warn(`Game does not has Witch role. Skip...`)
      return new WakeUp().handle()
    }

    if (witch.isDeath) {
      logger.warn(`Witch was death. Skip...`)
      return new WakeUp().handle()
    }

    if (gameState.witchUseKilled && gameState.witchUseSaved) {
      logger.info('Witch has already used both ability. Skip...')
      return new WakeUp().handle()
    }

    const channel = gameState.findTextChannelByRole(
      RoleIds.Witch
    ) as TextChannel

    const lastRoundDeathPlayers = gameState.players.filter((p) =>
      gameState.lastRoundDeath.has(p.raw.id)
    )

    await channel.send(
      `Dậy đi nào phù thủy ei.\nĐêm nay ${lastRoundDeathPlayers
        .map((p) => p.raw.displayName)
        .join(', ')} sẽ chết.\nBạn mún làm gì? Chọn ${Thumbsup}`
    )

    const skipMessage = await channel.send('Hem làm gì cả')
    gameState.witchSelectionMessages.set('skip', skipMessage)

    if (!gameState.witchUseKilled) {
      const killMessage = await channel.send('Giết')
      gameState.witchSelectionMessages.set('kill', killMessage)
    }

    if (!gameState.witchUseSaved) {
      const saveMessage = await channel.send('Cíu')
      gameState.witchSelectionMessages.set('save', saveMessage)
    }

    return new CheckWitchSelection()
  }
}

import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'
import { CheckSeerSelectionStep } from './check-seer-selection.step'

export class StartSeerTurn implements IStep {
  readonly __is_step = true
  async handle() {
    logger.info('Start seer turn.')
    if (gameState.findAllPlayersByRole(Role.Seer).length === 0) {
      logger.warn('Game does not has Seer role. Skip...')
      return new StartWereWolfTurn().handle()
    }

    if (!gameState.alivePlayers.find((p) => p.role.is(Role.Seer))) {
      logger.warn('Seer was death. Skip...')
      return new StartWereWolfTurn().handle()
    }

    const channel = gameState.findTextChannelByRole(Role.Seer) as TextChannel
    await channel.send(
      `Dậy đi nào Tiên tri ei.\nBạn mún tiên tri ai? Chọn ${Thumbsup}.`
    )
    const alivePlayers = gameState.alivePlayers.filter(
      (p) => p.role.id !== Role.Seer
    )
    for (const player of alivePlayers) {
      const message = await channel.send(`${player.raw}`)
      gameState.seerSelectionMessages.push(message)
    }

    logger.info('Waiting Seer selection.')
    return new CheckSeerSelectionStep()
  }
}

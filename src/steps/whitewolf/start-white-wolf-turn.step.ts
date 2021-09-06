import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { Player } from '../../player'
import { rand, sleep } from '../../utils'
import { IStep } from '../step'
import { StartWitchTurn } from '../witch/start-witch-turn.step'
import { CheckWhiteWolfSelection } from './check-whitewolf-selection.step'

export class StartWhiteWolfTurn implements IStep {
  async handle() {
    logger.info('Start white wolf turn.')
    const seconds = rand(20, 30)
    if (!gameState.hasRole(Role.WhiteWolf)) {
      return new StartWitchTurn().handle()
    }
    const killableWolfs = gameState.alivePlayers.filter((p) =>
      p.role.in([Role.WereWolf, Role.BlackWolf])
    )
    if (killableWolfs.length === 0) {
      return new StartWitchTurn().handle()
    }

    const whiteWolf = gameState.findPlayerByRole(Role.WhiteWolf) as Player
    if (
      gameState.whitewolfLastKillAt + 2 > gameState.round ||
      whiteWolf.isDeath
    ) {
      logger.info(`Skip in ${seconds} seconds`)
      await sleep(seconds * 1000)
      return new StartWitchTurn().handle()
    }

    const { embed, map } = createVotingMessage([
      { id: 'skip', text: 'Skip', icon: '⏩' },
      ...killableWolfs,
    ])

    embed.setTitle('Dậy đi Sói trắng êi, Bạn mún giết con sói nào')

    const message = await sendVotingMessage(
      whiteWolf.role.channel,
      embed,
      map,
      whiteWolf.toString()
    )

    return new CheckWhiteWolfSelection(message, map)
  }
}

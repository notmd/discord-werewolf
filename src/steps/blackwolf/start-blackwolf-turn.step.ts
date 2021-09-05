import { TextChannel } from 'discord.js'
import { Role, WOLFS } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWitchTurn } from '../witch/start-witch-turn.step'
import { CheckBlackWolfSelection } from './check-blackwolf-selection.step'

export class StartBlackWolfTurn implements IStep {
  async handle() {
    logger.info('Start Blackwolf turn.')

    if (!gameState.findPlayerByRole(Role.BlackWolf)) {
      logger.info('Game doesnt have Blackwolf.')
      return new StartWitchTurn().handle()
    }

    if (gameState.blackwolfCurseAt !== undefined) {
      logger.info(`Blackwolf cursed. Skip...`)
      return new StartWitchTurn().handle()
    }

    const curseablePlayers = gameState.players.filter(
      (p) => !p.role.in(WOLFS) && gameState.recentlyDeath.has(p.raw.id)
    )

    if (curseablePlayers.length === 0) {
      return new StartWitchTurn().handle()
    }

    const { embed, map } = createVotingMessage<'skip' | string>([
      { id: 'skip', text: 'Hem nguyền ai cả ⏩' },
      ...curseablePlayers,
    ])
    embed.setTitle('Bạn mún nguyền ai?')
    const message = await sendVotingMessage(
      gameState.findChannel(Role.BlackWolf) as TextChannel,
      embed,
      map
    )
    return new CheckBlackWolfSelection(message, map)
  }
}

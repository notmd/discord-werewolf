import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'
import { CheckCupidSelection } from './check-cupid-selection.step'

export class StartCupidTurn implements IStep {
  async handle() {
    logger.info('Start cupid turn.')
    const cupid = gameState.findPlayerByRole(Role.Cupid)
    if (!cupid) {
      logger.info('Game does not have Cupid role. Skip...')
      return new StartWereWolfTurn().handle()
    }

    if (gameState.couple !== undefined) {
      logger.info('Cupid has used ability. Skip...')
      return new StartWereWolfTurn().handle()
    }
    const channel = gameState.findChannel(Role.Cupid) as TextChannel

    const { embed, map } = createVotingMessage(gameState.alivePlayers)
    embed.setTitle(`Dậy đi Cupid. Bạn mún ai iu nhau (chọn 2 người)?`)
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckCupidSelection(message, map)
  }
}

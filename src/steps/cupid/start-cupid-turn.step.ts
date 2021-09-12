import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  createVotingMessage,
  fakeDelay,
  sendCannotUseAbilityReason,
  sendVotingMessage,
} from '../../helper'
import { logger } from '../../logger'
import { nextMessage } from '../../utils'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'
import { CheckCupidSelection } from './check-cupid-selection.step'

export class StartCupidTurn implements IStep {
  async handle() {
    logger.info('Start cupid turn.')
    if (!gameState.hasRole(Role.Cupid)) {
      logger.info('Game does not have Cupid role. Skip...')

      return new StartWereWolfTurn().handle()
    }
    const cupid = gameState.findPlayerByRole(Role.Cupid)!

    if (!cupid.canUseAbility) {
    }

    if (gameState.couple !== undefined || !cupid.canUseAbility) {
      if (gameState.couple === undefined) {
        await sendCannotUseAbilityReason(cupid)
        await fakeDelay()
      }
      // logger.info('Cupid has used ability. Skip...')

      return new StartWereWolfTurn().handle()
    }
    const channel = gameState.findChannel(Role.Cupid) as TextChannel

    const { embed, map } = createVotingMessage(gameState.alivePlayers)
    embed.setTitle(`Dậy đi Cupid. Bạn mún ai iu nhau (chọn 2 người)?`)
    const message = await sendVotingMessage(
      channel,
      { content: `${cupid}. ${nextMessage}`, embeds: [embed] },
      map
    )

    return new CheckCupidSelection(message, map)
  }
}

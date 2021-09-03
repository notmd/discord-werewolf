import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { logger } from '../../logger'
import { rand, sleep } from '../../utils'
import { StartCupidTurn } from '../cupid/start-cupid-turn.step'
import { IStep } from '../step'
import { CheckSeerSelectionStep } from './check-seer-selection.step'

export class StartSeerTurn implements IStep {
  async handle() {
    logger.info('Start seer turn.')
    const seer = gameState.findPlayerByRole(Role.Seer, {
      includeOriginal: true,
    })
    if (!seer) {
      logger.warn('Game does not has Seer role. Skip...')
      return new StartCupidTurn().handle()
    }

    if (!seer.canUseAbility) {
      const seconds = rand(20, 30)
      logger.warn(`Seer cant use ability. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)
      return new StartCupidTurn().handle()
    }

    const channel = gameState.findTextChannelByRole(Role.Seer) as TextChannel
    const alivePlayers = gameState.alivePlayers.filter(
      (p) => p.role.id !== Role.Seer
    )
    const { embed, map } = createVotingMessage(alivePlayers)
    embed.setTitle('Dậy đi nào Tiên tri ei. Bạn mún tiên tri ai?')
    const message = await sendVotingMessage(channel, embed, map)

    logger.info('Waiting Seer selection.')
    return new CheckSeerSelectionStep(message, map)
  }
}

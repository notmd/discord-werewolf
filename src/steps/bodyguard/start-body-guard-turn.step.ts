import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { logger } from '../../logger'
import { rand, sleep } from '../../utils'
import { StartSeerTurn } from '../seer/start-seer-turn.step'
import { IStep } from '../step'
import { CheckBodyGuardSelection } from './check-body-guard-selection.step'

export class StartBodyGuardTurn implements IStep {
  async handle(): Promise<any> {
    logger.info(`Start ${Role.BodyGuard} turn.`)

    const bodyGuard = gameState.findPlayerByRole(Role.BodyGuard, {
      includeOriginal: true,
    })
    if (!bodyGuard) {
      logger.warn(`Game does not has ${Role.BodyGuard} role. Skip...`)
      return new StartSeerTurn().handle()
    }

    if (!bodyGuard.canUseAbility) {
      const seconds = rand(20, 30)
      logger.warn(`Bodyguard cant use ability. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)
      return new StartSeerTurn().handle()
    }

    const alivePlayers = gameState.alivePlayers
    const protectablePlayers = alivePlayers.filter(
      (p) => p.raw.id !== gameState.bodyGuardLastSelection
    )
    const channel = gameState.findChannel(Role.BodyGuard) as TextChannel

    const { embed, map } = createVotingMessage(protectablePlayers)
    embed.setTitle('Dậy đi nào bảo vệ ei. Bạn mún bảo vệ ai?')
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckBodyGuardSelection(message, map)
  }
}

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
  readonly __is_step = true

  async handle(): Promise<any> {
    const bodyGuard = gameState.players.find((p) => p.role.is(Role.BodyGuard))
    logger.info(`Start ${Role.BodyGuard} turn.`)
    if (!bodyGuard) {
      logger.warn(`Game does not has ${Role.BodyGuard} role. Skip...`)
      return new StartSeerTurn().handle()
    }

    if (bodyGuard.isDeath) {
      const seconds = rand(20, 30)
      logger.warn(`${Role.BodyGuard} was death. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)
      return new StartSeerTurn().handle()
    }

    const alivePlayers = gameState.alivePlayers
    const protectablePlayers = alivePlayers.filter(
      (p) => p.raw.id !== gameState.bodyGuardLastSelection
    )
    const channel = gameState.findTextChannelByRole(
      Role.BodyGuard
    ) as TextChannel

    const { embed, map } = createVotingMessage(protectablePlayers)
    embed.setTitle('Dậy đi nào bảo vệ ei. Bạn mún bảo vệ ai?')
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckBodyGuardSelection(message, map)
  }
}

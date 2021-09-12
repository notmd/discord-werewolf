import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { nextMessage } from '../../utils'
import { StartDisscusion } from '../start-discussion.step'
import { StartSleep } from '../start-sleep.step'
import { IStep } from '../step'
import { CheckHunterSelection } from './check-hunter-selection.step'

export class StartHunterTurn implements IStep {
  constructor(private shouldStartDisscusion: boolean) {}

  async handle() {
    logger.info('Stating hunter step.')

    const hunter = gameState.findPlayerByRole(Role.Hunter)
    if (!hunter) {
      logger.info('Game does not have Hunter. Skip...')
      if (this.shouldStartDisscusion) {
        return new StartDisscusion().handle()
      }

      return new StartSleep().handle()
    }
    const mainChannel = gameState.otherTextChannels.get('main') as TextChannel
    await mainChannel.send(
      `${hunter.raw} là ${hunter.role.name} ${hunter.role.icon}`
    )

    const hunterChannel = gameState.findChannel(Role.Hunter) as TextChannel

    const { embed, map } = createVotingMessage(
      gameState.alivePlayers.filter(
        (p) => p.raw.id !== gameState.oldHagSelection
      )
    )
    embed.setTitle('Thợ săn, bạn đã chết. Giờ bạn mún bắn ai?')
    const message = await sendVotingMessage(
      hunterChannel,
      { content: `${hunter}. ${nextMessage}`, embeds: [embed] },
      map
    )

    return new CheckHunterSelection(this.shouldStartDisscusion, message, map)
  }
}

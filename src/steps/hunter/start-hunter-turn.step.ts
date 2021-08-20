import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
import { logger } from '../../logger'
import { StartDisscusion } from '../start-discussion.step'
import { StartSleep } from '../start-sleep.step'
import { IStep } from '../step'
import { CheckHunterSelection } from './check-hunter-selection.step'

export class StartHunterTurn implements IStep {
  readonly __is_step = true
  constructor(private shouldStartDisscusion: boolean) {}

  // @ts-ignore
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
    await mainChannel.send(`${hunter} là ${hunter.role.name}`)

    const hunterChannel = gameState.findTextChannelByRole(
      Role.Hunter
    ) as TextChannel
    hunterChannel.send(
      `Thợ săn, bạn đã chết. Giờ bạn mún bắn ai? Chọn ${Thumbsup}.`
    )
    for (const player of gameState.alivePlayers) {
      const message = await hunterChannel.send(player.raw.toString())
      gameState.hunterSelectionMessages.push(message)
    }

    return new CheckHunterSelection(this.shouldStartDisscusion)
  }
}

import { TextChannel } from 'discord.js'
import { Role, WOLFS } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWitchTurn } from '../witch/start-witch-turn.step'
import { CheckBlackWolfSelection } from './check-blackwolf-selection.step'

export class StartBlackWolfTurn implements IStep {
  readonly __is_step = true

  async handle() {
    if (gameState.blackwolfCurseAt !== undefined) {
      logger.info(`Blackwolf cursed. Skip...`)
      return new StartWitchTurn().handle()
    }
    const { embed, map } = createVotingMessage<'skip' | string>([
      { id: 'skip', text: 'Hem nguyền ai cả ⏩' },
      ...gameState.alivePlayers.filter((p) => !p.role.in(WOLFS)),
    ])
    embed.setTitle('Bạn mún nguyền ai?')
    const message = await sendVotingMessage(
      gameState.findTextChannelByRole(Role.BlackWolf) as TextChannel,
      embed,
      map
    )
    return new CheckBlackWolfSelection(message, map)
  }
}

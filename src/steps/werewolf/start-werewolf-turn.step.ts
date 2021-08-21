import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  createVotingMessage as createVoting,
  sendVotingMessage,
} from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { CheckWereWolfVotingResult } from './check-werewolf-voting-result.step'

export class StartWereWolfTurn implements IStep {
  readonly __is_step = true
  constructor() {}

  async handle() {
    logger.info('Start werewolf turn.')

    const wereWoflChannel = gameState.findTextChannelByRole(
      Role.WereWolf
    ) as TextChannel

    const { embed, map } = createVoting(gameState.alivePlayers)
    embed.setTitle('Dậy đi nào mấy con sói già. Mấy con sói già muốn giết ai?')
    const message = await sendVotingMessage(wereWoflChannel, embed, map)
    logger.info('Wating for werewolf voting result.')
    return new CheckWereWolfVotingResult(message, map)
  }
}

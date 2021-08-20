import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { Thumbsup } from '../../icons'
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
    await wereWoflChannel.send(
      `Dậy đi nào mấy con sói già.\nChọn ${Thumbsup} để vote.`
    )

    for (const p of gameState.alivePlayers) {
      const message = await wereWoflChannel.send(`${p.raw}`)
      gameState.wereWoflVotingMessages.push(message)
    }
    logger.info('Wating for werewolf voting result.')
    return new CheckWereWolfVotingResult()
  }
}

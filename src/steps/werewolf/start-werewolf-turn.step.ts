import { TextChannel } from 'discord.js'
import { Role, WOLFS } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  createVotingMessage as createVoting,
  sendVotingMessage,
} from '../../helper'
import { logger } from '../../logger'
import { nextMessage, rand, sleep } from '../../utils'
import { IStep } from '../step'
import { StartWitchTurn } from '../witch/start-witch-turn.step'
import { CheckWereWolfVotingResult } from './check-werewolf-voting-result.step'

export class StartWereWolfTurn implements IStep {
  constructor() {}

  async handle() {
    logger.info('Start werewolf turn.')

    const wereWoflChannel = gameState.findChannel(Role.WereWolf) as TextChannel
    const wolfs = gameState.alivePlayers.filter((p) => p.role.in(WOLFS))
    const canUseAbilityWolfs = wolfs.filter((w) => w.canUseAbility)
    const effectedByCaveWolfs = wolfs.filter((w) => w.isEffectedByCave)

    if (canUseAbilityWolfs.length === 0) {
      await wereWoflChannel.send(`Mấy con sói bị yếu hết ròi nha.`)
      await sleep(1000 * rand(20, 30))

      return new StartWitchTurn().handle()
    }

    const { embed, map } = createVoting(gameState.alivePlayers)
    embed.setTitle('Dậy đi nào mấy con sói già. Mấy con sói già muốn giết ai?')
    const message = await sendVotingMessage(
      wereWoflChannel,
      {
        content:
          `${gameState.alivePlayers
            .filter((p) => p.role.in(WOLFS))
            .join(', ')}. ${nextMessage}` +
          (effectedByCaveWolfs.length > 0)
            ? `Con sói ${effectedByCaveWolfs
                .map((w) => w.raw.displayName)
                .join(', ')} bị yếu ròi.`
            : '',
        embeds: [embed],
      },
      map
    )

    logger.info('Wating for werewolf voting result.')

    return new CheckWereWolfVotingResult(message, map)
  }
}

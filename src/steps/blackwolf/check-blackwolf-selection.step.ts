import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  collectVotes,
  givePermissionFor,
  selectRandomPlayerFromVotes,
} from '../../hepler'
import { logger } from '../../logger'
import { Player } from '../../player'
import { WereWolf } from '../../roles/werewolf.role'
import { IStep } from '../step'
import { StartWitchTurn } from '../witch/start-witch-turn.step'

export class CheckBlackWolfSelection implements IStep {
  readonly __is_step = true
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string | 'skip', Snowflake>
  ) {}
  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })

    if (votes.size === 0) {
      logger.info('Skip...')
      return new StartWitchTurn().handle()
    }

    const playerId = selectRandomPlayerFromVotes(votes)
    if (playerId === 'skip') {
      logger.info('Skip...')
      return new StartWitchTurn().handle()
    }

    const cursedPlayer = gameState.findPlayer(playerId) as Player
    gameState.blackwolfCurse = playerId
    gameState.blackwolfCurseAt = gameState.round
    cursedPlayer.setRole(new WereWolf())
    const wolfChannel = gameState.findTextChannelByRole(
      Role.WereWolf
    ) as TextChannel
    await givePermissionFor(wolfChannel, cursedPlayer)
    await wolfChannel.send(`${cursedPlayer.raw} bạn đã bị nguyền.`)

    return new StartWitchTurn().handle()
  }
}

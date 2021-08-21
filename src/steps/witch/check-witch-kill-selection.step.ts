import { Collection, Message, Snowflake } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { Player } from '../../player'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'

export class CheckWitchKillSelection implements IStep {
  readonly __is_step = true
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}
  async handle() {
    logger.info('Checking Witch kill selection.')
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })
    if (votes.size === 0) {
      logger.warn('Witch kill vote is empty. Skip...')
      return new WakeUp().handle()
    }

    const playerId = selectRandomPlayerFromVotes(votes)
    const player = gameState.players.find(
      (p) => p.raw.id === playerId
    ) as Player
    const witch = gameState.alivePlayers.find((p) => p.role.id === Role.Witch)
    try {
      witch?.role.kill(player)
      gameState.lastRoundActualDeath.add(playerId)
      gameState.witchUseKilled = true
      await gameState
        .findTextChannelByRole(Role.Witch)
        ?.send(`Bạn đã giết ${player?.raw.displayName}.`)
    } catch (e) {
      logger.error('Error while perform Witch kill step.')
      logger.error(e)
    }

    return new WakeUp().handle()
  }
}

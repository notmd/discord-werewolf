import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { getVotesFromMessages, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'

export class CheckSeerSelectionStep implements IStep {
  readonly __is_step = true

  async handle() {
    logger.info('Checking Seer selection')
    const messages = gameState.seerSelectionMessages
    const votes = (await getVotesFromMessages(messages)).filter((v) => v > 0)
    if (votes.size === 0) {
      logger.warn('Votes is empty. Skip...')
      return new StartWereWolfTurn().handle()
    }
    const playerId = selectRandomPlayerFromVotes(votes)
    const channel = gameState.findTextChannelByRole(Role.Seer) as TextChannel
    const player = gameState.findPlayer(playerId)
    await channel.send(
      `${player?.raw.displayName} ${
        player?.role.id === Role.WereWolf ? 'là sói.' : 'hem phải là sói.'
      }`
    )
    return new StartWereWolfTurn().handle()
  }
}

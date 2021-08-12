import { TextChannel } from 'discord.js'
import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { getVotesFromMessages, selectRandomPlayerFromVotes } from '../../hepler'
import { logger } from '../../logger'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-voting.step'

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
    const channel = gameState.findTextChannelByRole(RoleIds.Seer) as TextChannel
    const player = gameState.findPlayer(playerId)
    await channel.send(`${player?.raw.displayName} là ${player?.role.name}`)
    return new StartWereWolfTurn().handle()
  }
}

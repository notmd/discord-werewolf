import { getVotesFromMessages } from '../../hepler'
import { gameState } from '../../game-state'
import { StartDisscusion } from '../start-discussion.step'
import { IStep } from '../step'
import { logger } from '../../logger'
import { RoleIds } from '../../game-settings'

export class CheckWereWolfVotingResult implements IStep {
  readonly __is_step = true
  constructor() {}

  async handle() {
    logger.info('Checking werewolf voting results')
    const votingMessages = gameState.wereWoflVotingMessages
    const votes = await getVotesFromMessages(votingMessages)

    const max = Math.max.apply(null, Array.from(votes.values()))
    const playerId = votes.filter((v) => v === max).randomKey()
    const wolfs = gameState.findAllPlayersByRole(RoleIds.WereWolf)
    wolfs.forEach((w) => {
      w.role.kill(playerId)
    })

    return new StartDisscusion().handle()
  }
}

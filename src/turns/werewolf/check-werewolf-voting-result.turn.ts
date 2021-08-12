import { getVotesFromMessages } from '../../hepler'
import { gameState } from '../../game-state'
import { StartDisscusion } from '../start-discussion.turn'
import { ITurn } from '../turn'

export class CheckWereWolfVotingResult implements ITurn {
  readonly __is_turn = true
  constructor() {}

  async handle() {
    const votingMessages = gameState.wereWoflVotingMessages
    const votes = await getVotesFromMessages(votingMessages)

    const max = Math.max.apply(null, Array.from(votes.values()))
    const playerId = votes.filter((v) => v === max).randomKey()
    // console.log(max, playerId, votes)
    gameState.markPlayerAsDeath(playerId)
    gameState.clearVotingMessages('werewolf')

    return new StartDisscusion().handle()
  }
}

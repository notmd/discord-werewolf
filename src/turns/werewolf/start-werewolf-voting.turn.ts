import { RoleIds } from '../../game-settings'
import { gameState } from '../../game-state'
import { ITurn } from '../turn'
import { CheckWereWolfVotingResult } from './check-werewolf-voting-result.turn'

export class StartWereWolfTurn implements ITurn {
  readonly __is_turn = true
  constructor() {}

  // return id to stop and wait, return self to exec
  async handle() {
    const wereWoflChannel = gameState.findTextChannelByRole(RoleIds.WereWolf)
    if (wereWoflChannel) {
      await wereWoflChannel.send(`Chọn :thumbsup: để vote.`)
      const notWerWolfPlayers = gameState.players.filter(
        (p) => p.role.id !== RoleIds.WereWolf
      )
      for (const p of notWerWolfPlayers) {
        const message = await wereWoflChannel.send(`${p.raw}`)
        gameState.addWereWolfVotingMessage(message)
      }

      return new CheckWereWolfVotingResult()
    }
    return null
  }
}

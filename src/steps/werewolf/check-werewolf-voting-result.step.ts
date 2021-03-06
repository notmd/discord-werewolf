import {
  collectVotes,
  fetchReactionUsers,
  givePermission,
  selectRandomPlayerFromVotes,
} from '../../helper'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { Role, WOLFS } from '../../game-settings'
import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Player } from '../../player'
import { WereWolf } from '../../roles/werewolf.role'
import { StartWhiteWolfTurn } from '../whitewolf/start-white-wolf-turn.step'

export class CheckWereWolfVotingResult implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.players.filter((p) => p.role.in(WOLFS)).map((p) => p.raw.id)
    )
  }

  async handle() {
    logger.info('Checking werewolf voting results')
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)

    const player = gameState.findPlayer(playerId)!
    const wolfs = gameState.alivePlayers.filter((p) => p.role.in(WOLFS))
    const channel = gameState.findChannel(Role.WereWolf) as TextChannel
    const hasBlackwolfVote = await this.determineHasBlackwolfVote(player)
    if (hasBlackwolfVote) {
      gameState.blackwolfCurse = playerId
      gameState.blackwolfCurseAt = gameState.round
      gameState.deathPlayerReportToWitch.delete(playerId)
      gameState.recentlyDeath.delete(playerId)
      gameState.deathPlayers.delete(playerId)
      player.setRole(new WereWolf())
      await givePermission(channel, player)
    } else {
      player.onKill({ by: wolfs[0] as Player })
    }

    await channel.send(
      `Đã ${hasBlackwolfVote ? 'nguyền' : 'giết'} ${player.raw.displayName}.`
    )

    return new StartWhiteWolfTurn().handle()
  }

  private async determineHasBlackwolfVote(player: Player): Promise<boolean> {
    const blackwolf = gameState.findPlayerByRole(Role.BlackWolf)
    if (
      !blackwolf ||
      !blackwolf.canUseAbility ||
      gameState.blackwolfCurse ||
      player.role.in(WOLFS)
    ) {
      return false
    }

    const message = await this.votingMessage.fetch(true)

    const votedEmoji = this.votingMap.findKey(
      (value) => value === player.raw.id
    )

    if (!votedEmoji) {
      return false
    }

    const users = await fetchReactionUsers(message, votedEmoji)

    if (users) {
      return users.has(blackwolf.raw.id)
    }

    return false
  }
}

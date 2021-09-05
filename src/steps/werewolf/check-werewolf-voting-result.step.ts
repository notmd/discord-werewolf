import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { logger } from '../../logger'
import { Role, WOLFS } from '../../game-settings'
import { Collection, Message, Snowflake } from 'discord.js'
import { Player } from '../../player'
import { WereWolf } from '../../roles/werewolf.role'
import { StartWitchTurn } from '../witch/start-witch-turn.step'

export class CheckWereWolfVotingResult implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.in(WOLFS))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    logger.info('Checking werewolf voting results')
    const votes = await collectVotes(this.votingMessage, this.votingMap)
    const playerId = selectRandomPlayerFromVotes(votes)

    const player = gameState.findPlayer(playerId) as Player
    const wolfs = gameState.findAllPlayersByRole(Role.WereWolf)

    const hasBlackwolfVote = await this.determineHasBlackwolfVote(playerId)

    if (hasBlackwolfVote) {
      gameState.blackwolfCurse = playerId
      gameState.blackwolfCurseAt = gameState.round
      gameState.deathPlayerReportToWitch.delete(playerId)
      gameState.recentlyDeath.delete(playerId)
      gameState.deathPlayers.delete(playerId)
      player.setRole(new WereWolf())
    } else {
      wolfs.forEach((w) => {
        player.onKill({
          by: w,
        })
      })
    }

    await gameState
      .findChannel(Role.WereWolf)
      ?.send(
        `Đã ${hasBlackwolfVote ? 'nguyền' : 'giết'} ${player.raw.displayName}.`
      )
    logger.info(`Were wolf kill ${player.raw.displayName}.`)
    return new StartWitchTurn().handle()
  }

  private async determineHasBlackwolfVote(playerId: string): Promise<boolean> {
    const blackwolf = gameState.findPlayerByRole(Role.BlackWolf)
    if (!blackwolf) {
      return false
    }
    const message = await this.votingMessage.fetch(true)

    const votedIcon = this.votingMap.findKey((value) => value === playerId)

    if (!votedIcon) {
      return false
    }

    const isCustomIcon = votedIcon.includes(':')
    const reaction = message.reactions.cache.find(
      (r) =>
        r.emoji.name ===
        ((isCustomIcon ? votedIcon.split(':')[0] : votedIcon) as string)
    )
    if (reaction) {
      const fetchedUsers = await reaction.users.fetch()
      return fetchedUsers.has(blackwolf?.raw.id)
    }
    return false
  }
}

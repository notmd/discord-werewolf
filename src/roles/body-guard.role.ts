import { Snowflake } from 'discord-api-types'
import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { gameState } from '../game-state'
import {
  createVotingMessage,
  selectRandomPlayerFromVotes,
  sendVotingMessage,
} from '../helper'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'
import { Collection } from 'discord.js'
export class BodyGuard extends BaseRole implements IRole {
  readonly id = Role.BodyGuard
  readonly name = 'Bảo vệ'
  readonly faction = new VillageFaction()
  readonly roomName = Role.BodyGuard
  readonly icon = '🛡️'

  get protecablePlayer() {
    return gameState.alivePlayers.filter(
      (p) => p.raw.id !== gameState.bodyGuardLastSelection
    )
  }

  onWakeUp() {
    gameState.bodyGuardLastSelection = gameState.bodyGuardSelection
    gameState.bodyGuardSelection = null
  }

  async protect(votes: Collection<Snowflake, number>): Promise<void> {
    const playerId = selectRandomPlayerFromVotes(votes)

    gameState.bodyGuardSelection = playerId
    const player = gameState.findPlayer(playerId)

    // logger.info(`${Role.BodyGuard} has protect ${player?.raw.displayName}`)

    await this.channel.send(`Bạn đã bảo vệ ${player?.raw.displayName}`)
  }

  async displayProtectablePlayers() {
    const { embed, map } = createVotingMessage(this.protecablePlayer)
    embed.setTitle('Dậy đi nào bảo vệ ei. Bạn mún bảo vệ ai?')
    const message = await sendVotingMessage(
      this.channel,
      embed,
      map,
      gameState.findPlayerByRole(this.id)?.raw.toString()
    )

    return { message, map }
  }
}

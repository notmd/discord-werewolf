import { Message, Collection } from 'discord.js'
import { Snowflake } from 'discord-api-types'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { IStep } from '../step'
import { collectVotes, selectRandomPlayerFromVotes } from '../../helper'
import { StartWitchTurn } from '../witch/start-witch-turn.step'

export class CheckWhiteWolfSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}
  get allowedId() {
    return new Set([gameState.findPlayerByRole(Role.WhiteWolf)!.raw.id])
  }

  async handle() {
    const votes = await collectVotes(this.votingMessage, this.votingMap, {})
    const playerId = selectRandomPlayerFromVotes(votes)
    const whiteWolf = gameState.findPlayerByRole(Role.WhiteWolf)!

    if (playerId === 'skip') {
      await whiteWolf.role.channel.send(`Ok skip.`)

      return new StartWitchTurn().handle()
    }

    const player = gameState.findPlayer(playerId)!
    player.onKill({ by: whiteWolf })

    await whiteWolf.role.channel.send(`Đã giết ${player.raw.displayName}`)

    return new StartWitchTurn().handle()
  }
}

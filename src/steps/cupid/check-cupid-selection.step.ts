import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, givePermission } from '../../helper'
import { Player } from '../../player'
import { sleep } from '../../utils'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'

export class CheckCupidSelection implements IStep {
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  get allowedId() {
    return new Set(
      gameState.alivePlayers
        .filter((p) => p.role.is(Role.Cupid))
        .map((p) => p.raw.id)
    )
  }

  async handle() {
    const channel = gameState.findChannel(Role.Cupid) as TextChannel
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })

    if (votes.size !== 2) {
      await channel.send(
        `Chọn 2 người cơ mà? Mày chọn ${votes.size} người đmm.`
      )

      return this
    }

    const couple = gameState.alivePlayers.filter((p) =>
      votes.has(p.raw.id)
    ) as [Player, Player]

    gameState.couple = [couple[0].raw.id, couple[1].raw.id]

    const coupleChannel = gameState.findChannel(Role.Couple) as TextChannel
    for (const player of couple) {
      await sleep(200)
      await givePermission(coupleChannel, player)
    }
    await coupleChannel.send(`${couple.join(', ')} 2 pạn đã iu nhao.`)

    return new StartWereWolfTurn().handle()
  }
}

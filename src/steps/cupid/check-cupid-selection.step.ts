import { Collection, Message, Snowflake, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { collectVotes, givePermissionFor } from '../../hepler'
import { Player } from '../../player'
import { sleep } from '../../utils'
import { IStep } from '../step'
import { StartWereWolfTurn } from '../werewolf/start-werewolf-turn.step'

export class CheckCupidSelection implements IStep {
  readonly __is_step = true
  constructor(
    private votingMessage: Message,
    private votingMap: Collection<string, Snowflake>
  ) {}

  async handle() {
    const channel = gameState.findTextChannelByRole(Role.Cupid) as TextChannel
    const votes = await collectVotes(this.votingMessage, this.votingMap, {
      onlyPositive: true,
    })

    if (votes.size !== 2) {
      await channel.send(`Chọn 2 người cơ mà? Mày chọn ${votes.size}.`)
      return this
    }

    const couple = gameState.alivePlayers.filter((p) =>
      votes.has(p.raw.id)
    ) as [Player, Player]
    const coupleChannel = gameState.findTextChannelByRole(
      Role.Couple
    ) as TextChannel
    for (const player of couple) {
      await sleep(200)
      await givePermissionFor(coupleChannel, player)
    }
    await coupleChannel.send(
      `${couple.map((p) => p.raw).join(', ')} 2 pạn đã iu nhao.`
    )
    return new StartWereWolfTurn().handle()
  }
}

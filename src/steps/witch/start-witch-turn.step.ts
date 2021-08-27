import { Collection, MessageEmbed, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../hepler'
import { Letters } from '../../icons'
import { logger } from '../../logger'
import { Letter } from '../../types'
import { rand, sleep } from '../../utils'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { CheckWitchSelection } from './check-witch-selection.step'

export class StartWitchTurn implements IStep {
  readonly __is_step = true

  async handle() {
    const witch = gameState.players.find((p) => p.role.is(Role.Witch))
    logger.info(`Start Witch turn.`)
    if (!witch) {
      logger.warn(`Game does not has Witch role. Skip...`)
      return new WakeUp().handle()
    }

    if (witch.isDeath && !gameState.lastRoundDeath.has(witch.raw.id)) {
      const seconds = rand(20, 30)
      logger.warn(`Witch was death. Skip in ${seconds} seconds.`)
      await sleep(seconds * 1000)
      return new WakeUp().handle()
    }

    if (gameState.witchUseKilled && gameState.witchUseSaved) {
      const seconds = rand(20, 30)
      logger.warn(
        `Witch has already used both ability. Skip in ${seconds} seconds.`
      )
      await sleep(seconds * 1000)
      return new WakeUp().handle()
    }

    const channel = gameState.findTextChannelByRole(Role.Witch) as TextChannel

    const lastRoundDeathPlayers = gameState.players.filter((p) =>
      gameState.lastRoundDeath.has(p.raw.id)
    )

    const { embed, map } = this.createVotingMessage()
    embed.setTitle(
      `Dậy đi nào phù thủy ei. Đêm nay ${lastRoundDeathPlayers
        .map((p) => p.raw.displayName)
        .join(', ')} sẽ chết.`
    )
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckWitchSelection(message, map)
  }

  private createVotingMessage() {
    const options: Array<{ id: 'skip' | 'kill' | 'save'; text: string }> = [
      { id: 'skip', text: ' Hem làm gì cả`' },
    ]
    if (!gameState.witchUseKilled) {
      options.push({ id: 'kill', text: 'Giết' })
    }

    if (!gameState.witchUseSaved) {
      options.push({ id: 'save', text: 'Cứu' })
    }

    return createVotingMessage<'skip' | 'kill' | 'save'>(options)
  }
}

import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { createVotingMessage, sendVotingMessage } from '../../helper'
import { logger } from '../../logger'
import { rand, sleep } from '../../utils'
import { IStep } from '../step'
import { WakeUp } from '../wake-up.step'
import { CheckWitchSelection } from './check-witch-selection.step'

export class StartWitchTurn implements IStep {
  async handle() {
    const witch = gameState.findPlayerByRole(Role.Witch)
    logger.info(`Start Witch turn.`)
    if (!witch) {
      logger.warn(`Game does not has Witch role. Skip...`)
      return new WakeUp().handle()
    }

    if (!witch.canUseAbility && !gameState.recentlyDeath.has(witch.raw.id)) {
      const seconds = rand(20, 30)
      logger.warn(`Witch cant use ability. Skip in ${seconds} seconds.`)
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

    const channel = gameState.findChannel(Role.Witch) as TextChannel

    const lastRoundDeathPlayers = gameState.players.filter((p) =>
      gameState.recentlyDeath.has(p.raw.id)
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
    const options: Array<{
      id: 'skip' | 'kill' | 'save'
      text: string
      icon?: string
    }> = [{ id: 'skip', text: 'Hem làm gì cả', icon: '⏩' }]
    if (!gameState.witchUseKilled) {
      options.push({ id: 'kill', text: 'Giết', icon: '💀' })
    }

    if (!gameState.witchUseSaved) {
      options.push({ id: 'save', text: 'Cứu', icon: '🚑' })
    }

    return createVotingMessage<'skip' | 'kill' | 'save'>(options)
  }
}

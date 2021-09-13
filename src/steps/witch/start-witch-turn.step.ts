import { TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import {
  createVotingMessage,
  fakeDelay,
  sendCannotUseAbilityReason,
  sendVotingMessage,
} from '../../helper'
import { logger } from '../../logger'
import { StartOldHagTurn } from '../oldhag/start-old-hag-turn.step'
import { IStep } from '../step'
import { CheckWitchSelection } from './check-witch-selection.step'

export class StartWitchTurn implements IStep {
  async handle() {
    logger.info(`Start Witch turn`)
    if (!gameState.hasRole(Role.Witch)) {
      return new StartOldHagTurn().handle()
    }
    const witch = gameState.findPlayerByRole(Role.Witch)!

    if (
      (!witch.canUseAbility && !witch.wasDeathRecently) ||
      (gameState.witchUseKilled && gameState.witchUseSaved)
    ) {
      await sendCannotUseAbilityReason(witch)
      await fakeDelay()

      return new StartOldHagTurn().handle()
    }

    const channel = gameState.findChannel(Role.Witch) as TextChannel

    const lastRoundDeathPlayers = gameState.players.filter((p) =>
      gameState.deathPlayerReportToWitch.has(p.raw.id)
    )

    const { embed, map } = this.createVotingMessage()
    embed.setTitle(
      `Dậy đi nào phù thủy ei. Đêm nay ${
        lastRoundDeathPlayers.length > 0
          ? `${lastRoundDeathPlayers
              .map((p) => p.raw.displayName)
              .join(', ')} sẽ chết.`
          : 'hem ai chết cả.'
      }`
    )
    const message = await sendVotingMessage(
      channel,
      { content: `${witch}.`, embeds: [embed] },
      map
    )

    return new CheckWitchSelection(message, map)
  }

  private createVotingMessage() {
    const options: Array<{
      id: 'skip' | 'kill' | 'save'
      text: string
      icon?: string
    }> = [{ id: 'skip', text: 'Hem làm gì cả', icon: '⏩' }]
    if (!gameState.witchUseKilled) {
      options.push({ id: 'kill', text: 'Giết người khác', icon: '💀' })
    }

    if (!gameState.witchUseSaved) {
      options.push({ id: 'save', text: 'Cứu', icon: '🚑' })
    }

    return createVotingMessage<'skip' | 'kill' | 'save'>(options)
  }
}

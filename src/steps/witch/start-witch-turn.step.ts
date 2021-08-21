import { Collection, MessageEmbed, TextChannel } from 'discord.js'
import { Role } from '../../game-settings'
import { gameState } from '../../game-state'
import { sendVotingMessage } from '../../hepler'
import { Letters } from '../../icons'
import { logger } from '../../logger'
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

    if (witch.isDeath) {
      logger.warn(`Witch was death. Skip...`)
      return new WakeUp().handle()
    }

    if (gameState.witchUseKilled && gameState.witchUseSaved) {
      logger.info('Witch has already used both ability. Skip...')
      return new WakeUp().handle()
    }

    const channel = gameState.findTextChannelByRole(Role.Witch) as TextChannel

    const lastRoundDeathPlayers = gameState.players.filter((p) =>
      gameState.lastRoundDeath.has(p.raw.id)
    )

    const { embed, map } = this.createVotingMessage()
    embed.setTitle(
      `Dậy đi nào phù thủy ei.\nĐêm nay ${lastRoundDeathPlayers
        .map((p) => p.raw.displayName)
        .join(', ')}`
    )
    const message = await sendVotingMessage(channel, embed, map)

    return new CheckWitchSelection(message, map)
  }

  private createVotingMessage() {
    const letters = [...Letters.values()]
    const embed = new MessageEmbed()
    const map = new Collection<string, 'kill' | 'save' | 'skip'>([
      [letters[0] as string, 'skip'],
    ])
    const descriptions: string[] = ['Hem làm gì cả']
    let index: number = 1
    if (!gameState.witchUseKilled) {
      map.set(letters[index] as string, 'kill')
      descriptions.push('Giết')
      index++
    }

    if (!gameState.witchUseSaved) {
      map.set(letters[index] as string, 'skip')
      descriptions.push('Cứu')
      index++
    }
    embed.setDescription(descriptions.join('\n\n'))

    return { embed, map }
  }
}

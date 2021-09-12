import { Message } from 'discord.js'
import { gameSettings } from '../../game-settings'

export class ShowRoleCommandHandler {
  constructor(private message: Message) {}
  async handle() {
    const content = Array.from(gameSettings.roles.values())
      .map((role) => `${role.id}: ${role.name} ${role.icon}`)
      .join('\n')
    await this.message.reply(content)
  }
}

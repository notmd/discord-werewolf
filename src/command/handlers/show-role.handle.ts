import { Message } from 'discord.js'
import { ADMIN_ID, gameSettings } from '../../game-settings'

export class ShowRoleCommandHandler {
  constructor(private message: Message) {}
  async handle() {
    if (!ADMIN_ID.includes(this.message.author.id)) return

    const content = Array.from(gameSettings.roles.values())
      .map((role) => `${role.id}: ${role.name} ${role.icon}`)
      .join('\n')
    await this.message.reply(content)
  }
}

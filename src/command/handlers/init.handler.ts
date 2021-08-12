import { Message, Permissions } from 'discord.js'
import { discordClient } from '../../discord-client'
import { CHANNEL_NAME_PREFIX, gameSettings } from '../../game-settings'

export class InitCommandHandler {
  constructor(private message: Message) {}
  async handle() {
    const res: Array<string | undefined> = []
    for (const [name, options] of Array.from(gameSettings.channels.entries())) {
      const message = await this.createChannel({
        name,
        ...options,
      })
      res.push(message)
    }

    res.push('Initialize completed.')
    this.message.reply(res.filter((item) => item).join('\n'))
  }

  private async createChannel(options: {
    name: string
    type: 'GUILD_TEXT' | 'GUILD_VOICE'
    visibility: 'public' | 'private'
  }): Promise<string | undefined> {
    if (!options.name) {
      return undefined
    }

    const channel = discordClient.channels.cache.find((channel) => {
      const parseChannel = channel.toJSON() as {
        name: string
      }
      return (
        `${CHANNEL_NAME_PREFIX}${options.name}` === parseChannel.name &&
        ((channel.isText() && options.type === 'GUILD_TEXT') ||
          (channel.isVoice() && options.type === 'GUILD_VOICE'))
      )
    })
    if (!channel) {
      await this.message.guild?.channels.create(
        `${CHANNEL_NAME_PREFIX}${options.name}`,
        {
          type: options.type,
          permissionOverwrites:
            options.visibility === 'private'
              ? [
                  {
                    deny: Permissions.FLAGS.VIEW_CHANNEL,
                    id: this.message.guild.roles.everyone,
                  },
                ]
              : [],
        }
      )
      return `Created ${options.name} ${options.type} room.`
    }

    return undefined
  }
}

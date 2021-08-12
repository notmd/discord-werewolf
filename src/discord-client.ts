import { Client, Intents } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()
export const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

discordClient.once('ready', () => {
  console.log('ready')
})

// @ts-expect-error
discordClient.login(process.env.DISCORD_TOKEN)

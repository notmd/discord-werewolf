import { Client, Intents } from 'discord.js'

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

discordClient.login(
  'ODczODYwNTgzNzM1Mjk2MDEw.YQ-kFg.oNnKQql-BS6RTM9rgys-gsaNT_8'
)

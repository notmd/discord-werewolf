import { discordClient } from './src/discord-client'
import { CommandHandler } from './src/game-command-handler'

discordClient.on('messageCreate', (e) => new CommandHandler().handle(e))

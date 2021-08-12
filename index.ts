import { discordClient } from './src/discord-client'
import { GameHandler } from './src/game-command-handler'

discordClient.on('messageCreate', (e) => new GameHandler().handle(e))
// discordClient.on('messageReactionAdd', (e) => new VotingHandler(e).handle())

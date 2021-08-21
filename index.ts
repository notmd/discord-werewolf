import { discordClient } from './src/discord-client'
import { CommandHandler } from './src/game-command-handler'
// import { VoiceStateHandler } from './src/voice-state-handler'

discordClient.on('messageCreate', (e) => new CommandHandler().handle(e))
// discordClient.on('voiceStateUpdate', (_oldState, newState) =>
//   new VoiceStateHandler(newState).handle()
// )

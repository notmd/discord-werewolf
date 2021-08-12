import { Message } from 'discord.js'
import { gameState } from './game-state'
import yargs from 'yargs/yargs'
import { Arguments } from 'yargs'
import { StartGameCommandHandler } from './command/handlers/start-game.hanlder'
import { InitCommandHandler } from './command/handlers/init.handler'
import { COMMAND_PREFIX } from './game-settings'
import { gameProgress } from './game-progress'

const ADMIN_ID = '621326534803849218'

export class CommandHandler {
  async handle(e: Message) {
    if (e.author.id !== ADMIN_ID && !e.content.startsWith(COMMAND_PREFIX))
      return
    yargs()
      .scriptName(COMMAND_PREFIX)
      .command('init', 'initialize gem', {}, () => {
        new InitCommandHandler(e).handle()
      })
      .command(
        'start <roles>',
        'start gem',
        (y) => {
          y.option('ignore', {
            type: 'string',
          })
        },
        (argv: Arguments<{ roles?: string; ignore?: string }>) => {
          new StartGameCommandHandler(e, argv).handle()
        }
      )
      .command('state', 'show all game state', {}, () => {
        this.sendGameState(e)
      })
      .command('next', 'next turn', {}, () => {
        gameProgress.next(e)
      })
      .exitProcess(false)
      .parse(e.content.slice(COMMAND_PREFIX.length).trim())
  }

  private sendGameState(e: Message) {
    e.reply(JSON.stringify(gameState, null, 2))
  }
}

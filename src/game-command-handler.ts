import { Message } from 'discord.js'
import { gameState } from './game-state'
import yargs from 'yargs/yargs'
import { Arguments } from 'yargs'
import { StartGameCommandHandler } from './command/handlers/start-game.hanlder'
import { InitCommandHandler } from './command/handlers/init.handler'
import { COMMAND_PREFIX } from './game-settings'
import { gameProgress } from './game-progress'
import { ShowRoleCommandHandler } from './command/handlers/show-role.handle'

const ADMIN_ID = '621326534803849218'
const validIds = new Set([ADMIN_ID])

export class CommandHandler {
  async handle(e: Message) {
    gameState.controller && validIds.add(gameState.controller)
    if (!validIds.has(e.author.id) || !e.content.startsWith(COMMAND_PREFIX))
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
        (
          argv: Arguments<{
            roles?: string
            ignore?: string
            controller?: string
          }>
        ) => {
          new StartGameCommandHandler(e, argv).handle()
        }
      )
      .command('state', 'show all game state', {}, () => {
        this.sendGameState(e)
      })
      .command('next', 'next turn', {}, () => {
        gameProgress.next(e)
      })
      .command('roles', 'show all roles', {}, () => {
        new ShowRoleCommandHandler(e).handle()
      })
      .exitProcess(false)
      .parse(e.content.slice(COMMAND_PREFIX.length).trim())
  }

  private async sendGameState(e: Message) {
    try {
      await e.reply(JSON.stringify(gameState, null, 2))
    } catch (e) {}
    console.log(JSON.stringify(gameState, null, 2))
  }
}

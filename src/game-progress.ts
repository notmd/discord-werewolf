import { Message } from 'discord.js'
import { gameState } from './game-state'
import { ITurn, ITurnConstrucable } from './turns/turn'
import { StartWereWolfTurn } from './turns/werewolf/start-werewolf-voting.turn'
import { isTurn } from './utils'

class GameProgress {
  private currentTurn: ITurn = new StartWereWolfTurn()
  private nextTurn: ITurn | undefined
  constructor() {}
  async next(message: Message) {
    if (!gameState.isRunning) {
      await message.reply(`Game not started yet.`)
      return
    }
    const turn = this.nextTurn || this.currentTurn
    const res = await turn.handle()
    if (isTurn(res)) this.nextTurn = res
  }
}
export const gameProgress = new GameProgress()

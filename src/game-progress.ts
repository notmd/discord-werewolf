import { Message } from 'discord.js'
import { gameState } from './game-state'
import { authorizeMessage } from './hepler'
import { StartSleep } from './steps/start-sleep.step'
import { IStep } from './steps/step'

class GameProgress {
  private startStep: IStep = new StartSleep()
  private nextStep: IStep | undefined
  constructor() {}
  async next(message: Message) {
    if (!gameState.isRunning) {
      await message.reply(`Game not started yet.`)
      return
    }
    const step = this.nextStep || this.startStep
    if (authorizeMessage(message, step.allowedId)) {
      const res = await step.handle()
      if (res) {
        this.nextStep = res
      }
    } else {
      await message.reply('Chưa đến lượt của pạn.')
    }
  }
}
export const gameProgress = new GameProgress()

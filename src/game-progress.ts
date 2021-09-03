import { Message } from 'discord.js'
import { gameState } from './game-state'
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
    const res = await step.handle()
    if (res) {
      this.nextStep = res
    }
  }
}
export const gameProgress = new GameProgress()

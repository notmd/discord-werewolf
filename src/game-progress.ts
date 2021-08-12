import { Message } from 'discord.js'
import { gameState } from './game-state'
import { StartSeerTurn } from './steps/seer/start-seer-turn.step'
import { StartSleepStep } from './steps/start-sleep.step'
import { IStep } from './steps/step'
import { isStep } from './utils'

class GameProgress {
  private currentStep: IStep = new StartSleepStep()
  private nextStep: IStep | undefined
  constructor() {}
  async next(message: Message) {
    if (!gameState.isRunning) {
      await message.reply(`Game not started yet.`)
      return
    }
    const turn = this.nextStep || this.currentStep
    const res = await turn.handle()
    if (isStep(res)) {
      this.nextStep = res
    }
  }
}
export const gameProgress = new GameProgress()

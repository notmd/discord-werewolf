import { VoiceState } from 'discord.js'
import { gameState } from './game-state'
import { Player } from './player'

export class VoiceStateHandler {
  private player?: Player
  constructor(private newState: VoiceState) {
    this.player = gameState.players.find((p) => this.newState.id === p.raw.id)
  }
  async handle() {
    if (!gameState.isRunning || !this.player) {
      return
    }
    if (this.player.isDeath) {
      if (this.newState.channelId === gameState.voiceChannels.death?.id) {
        // death user join death channel
        this.newState.serverMute && this.newState.setMute(false)
      } else if (this.newState.channelId === gameState.voiceChannels.main?.id) {
        // death user join main channl
        !this.newState.serverMute && this.newState.setMute(true)
      }
    } else {
      if (this.newState.channelId === gameState.voiceChannels.death?.id) {
        // alive user join death channel
        this.newState.serverDeaf && this.newState.setDeaf(false)
      } else if (this.newState.channelId === gameState.voiceChannels.main?.id) {
        // alive user join main channl
        !this.newState.selfDeaf && this.newState.setDeaf(true)
      }
    }
  }
}

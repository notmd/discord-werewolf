import { Collection, Message } from 'discord.js'
import { gameState } from './game-state'
import { Thumbsup } from './icons'

export const muteAllDeathPlayer = async () => {
  const deathPlayers = gameState.deathPlayers
  for (const deathPlayer of deathPlayers) {
    const p = gameState.findPlayer(deathPlayer)
    if (p && !p.raw.voice.serverMute) {
      await p.raw.voice.setMute(true)
    }
  }
}

export const getVotesFromMessages = async (
  messages: Message[]
): Promise<Collection<string, number>> => {
  const votes: Collection<string, number> = new Collection()
  for (const message of messages) {
    const fetched = await message.fetch(true)
    const player = fetched.mentions.users.first()
    if (player) {
      const thumbsupReaction = fetched.reactions.cache
        .filter((r) => r.emoji.name === Thumbsup)
        .first()
      if (thumbsupReaction) {
        const alivePlayers = gameState.alivePlayers
        const invalidReactionCount = thumbsupReaction.users.cache.filter(
          (u) => !alivePlayers.some((p) => p.raw.id === u.id)
        ).size
        votes.set(player.id, thumbsupReaction.count - invalidReactionCount)
      }
    }
  }

  return votes
}

export const selectRandomPlayerFromVotes = (
  votes: Collection<string, number>
): string => {
  const max = Math.max.apply(null, Array.from(votes.values()))
  return votes.filter((v) => v === max).randomKey()
}

export const checkWereWolfWin = (): boolean => {
  const alivePlayers = gameState.alivePlayers
  return alivePlayers.every((p) => p.role.faction === 'wolf')
}

export const checkVillagerWin = (): boolean => {
  const alivePlayers = gameState.alivePlayers
  return alivePlayers.every((p) => p.role.faction === 'village')
}
export const checkWin = (): boolean => {
  return checkVillagerWin() || checkWereWolfWin()
}

export const unmuteEveryone = async (): Promise<void> => {
  const mainVoiceChannel = gameState.voiceChannels.main
  if (mainVoiceChannel) {
    for (const member of mainVoiceChannel.members.values()) {
      await member.voice.setMute(false)
    }
  }
}

export const sendVillagerWinMessage = async (): Promise<void> => {
  const mainTextChannel = gameState.otherTextChannels.get('main')
  if (!mainTextChannel) {
    throw new Error('cannot find main text channel.')
  }
  await mainTextChannel.send(
    `Phe dân làng đã win.\n${gameState.players
      .map((p) => `${p.raw} là \`${p.role.name}`)
      .join('\n')}}`
  )
}
export const sendWereWolfWinMessage = async (): Promise<void> => {
  const mainTextChannel = gameState.otherTextChannels.get('main')
  if (!mainTextChannel) {
    throw new Error('cannot find main text channel.')
  }
  await mainTextChannel.send(
    `Phe sói đã win.\n${gameState.players
      .map((p) => `${p.raw} là \`${p.role.name}`)
      .join('\n')}}`
  )
}

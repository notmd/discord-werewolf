import {
  Collection,
  Message,
  MessageEmbed,
  Snowflake,
  TextChannel,
} from 'discord.js'
import { gameState } from './game-state'
import { Letters, Thumbsup } from './icons'
import { Player } from './player'

export const muteAllDeathPlayer = async () => {
  const deathPlayers = gameState.deathPlayers
  for (const deathPlayer of deathPlayers) {
    const p = gameState.findPlayer(deathPlayer)
    if (p && !p.raw.voice.serverMute) {
      await p.raw.voice.setMute(true)
    }
  }
}
/**
 * @deprecated
 */
export const getVotesFromMessages = async (
  messages: Message[]
): Promise<Collection<string, number>> => {
  const votes: Collection<string, number> = new Collection()
  for (const message of messages) {
    const fetched = await message.fetch(true)
    const player = fetched.mentions.users.first()
    if (player) {
      fetched.reactions.cache.forEach((r) => console.log(r))
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

export const selectRandomPlayerFromVotes = <T extends string = string>(
  votes: Collection<T, number>
): T => {
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
      .map((p) => `${p.raw} là \`${p.role.name}\``)
      .join('\n')}`
  )
}
export const sendWereWolfWinMessage = async (): Promise<void> => {
  const mainTextChannel = gameState.otherTextChannels.get('main')
  if (!mainTextChannel) {
    throw new Error('cannot find main text channel.')
  }
  await mainTextChannel.send(
    `Phe sói đã win.\n${gameState.players
      .map((p) => `${p.raw} là \`${p.role.name}\``)
      .join('\n')}}`
  )
}

export const createVotingMessage = (
  players: Player[]
): { embed: MessageEmbed; map: Collection<string, Snowflake> } => {
  const embed = new MessageEmbed()
  const map = new Collection<string, Snowflake>()
  const letters = [...Letters.values()]
  embed.setDescription(
    players
      .map((player, index) => {
        const letter = letters[index] as string
        map.set(letter, player.raw.id)
        return `${letter} ${player.raw.displayName}`
      })
      .join('\n\n')
  )

  return { embed, map }
}

export const sendVotingMessage = async (
  channel: TextChannel,
  embed: MessageEmbed,
  map: Collection<string, Snowflake>
) => {
  const message = await channel.send({ embeds: [embed] })
  Promise.all(
    [...map.keys()].map((letter) => {
      message.react(letter)
    })
  )

  return message
}

export const collectVotes = async <T extends string = Snowflake>(
  message: Message,
  map: Collection<string, T>,
  { onlyPositive }: { onlyPositive?: boolean } = {}
) => {
  const fetched = await message.fetch(true)
  const votes: Collection<T, number> = new Collection()

  map.forEach((playerId, reaction) => {
    const count = fetched.reactions.cache
      .filter((r) => {
        console.log(r.emoji.name, reaction, r.emoji.name === reaction)
        return r.emoji.name === reaction
      })
      .first()?.count as number
    votes.set(playerId, count - 1)
  })
  if (onlyPositive) {
    return votes.filter((v) => v > 0)
  }
  return votes
}

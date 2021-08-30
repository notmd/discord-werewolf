import {
  Collection,
  Message,
  MessageEmbed,
  Snowflake,
  TextChannel,
} from 'discord.js'
import { gameState } from './game-state'
import { Letters } from './icons'
import { Player } from './player'
import { Letter } from './types'

export const muteAllDeathPlayer = async () => {
  const deathPlayers = gameState.deathPlayers
  for (const deathPlayer of deathPlayers) {
    const p = gameState.findPlayer(deathPlayer)
    if (p && !p.raw.voice.serverMute) {
      await p.raw.voice.setMute(true)
    }
  }
}

export const selectRandomPlayerFromVotes = <T extends string = string>(
  votes: Collection<T, number>
): T => {
  const max = Math.max.apply(null, Array.from(votes.values()))
  return votes.filter((v) => v === max).randomKey()
}

export const checkWereWolfWin = (): boolean => {
  const alivePlayers = gameState.alivePlayers
  const wolfs = alivePlayers.filter((p) => p.role.faction === 'wolf').length
  return wolfs * 2 >= alivePlayers.length
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
const createRolesEmbedMessage = () => {
  return new MessageEmbed().setDescription(
    `\n${gameState.players
      .map(
        (p) => `\`${p.raw.displayName}\` là \`${p.role.name}\` ${p.role.icon}`
      )
      .join('\n\n')}`
  )
}

export const sendVillagerWinMessage = async (): Promise<void> => {
  const mainTextChannel = gameState.otherTextChannels.get('main')
  if (!mainTextChannel) {
    throw new Error('cannot find main text channel.')
  }
  await mainTextChannel.send({
    embeds: [createRolesEmbedMessage().setTitle('Phe dân làng đã win')],
  })
}
export const sendWereWolfWinMessage = async (): Promise<void> => {
  const mainTextChannel = gameState.otherTextChannels.get('main')
  if (!mainTextChannel) {
    throw new Error('cannot find main text channel.')
  }

  await mainTextChannel.send({
    embeds: [createRolesEmbedMessage().setTitle('Phe sói đã win')],
  })
}

export const createVotingMessage = <T extends string = Snowflake>(
  players: Array<Player | { id: T; text: string }>
): { embed: MessageEmbed; map: Collection<Letter, T> } => {
  const embed = new MessageEmbed()
  const map = new Collection<Letter, T>()
  const letters = [...Letters.values()]
  embed.setDescription(
    players
      .map((player, index) => {
        const letter = letters[index] as Letter
        if (player instanceof Player) {
          map.set(letter, player.raw.id as T)
          return `${letter} ${player.raw.displayName}`
        }
        map.set(letter, player.id)
        return `${letter} ${player.text}`
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
  await Promise.all(
    [...map.keys()].map((letter) => {
      message.react(letter)
    })
  )

  return message
}

export const collectVotes = async <T extends string = Snowflake>(
  message: Message,
  map: Collection<string, T>,
  {
    onlyPositive,
    withMayorVote,
  }: { onlyPositive?: boolean; withMayorVote?: boolean } = {}
) => {
  const fetched = await message.fetch(true)
  const votes: Collection<T, number> = new Collection()
  for (const [reaction, playerId] of map.entries()) {
    const vote = fetched.reactions.cache.find((r) => {
      return r.emoji.name === reaction
    })
    if (vote) {
      let count = vote.count
      if (withMayorVote) {
        const fetchedUsers = await vote.users.fetch()
        const hasMayor = fetchedUsers.some(
          (user) => user.id === gameState.mayorId
        )
        if (hasMayor) {
          count++
        }
      }
      votes.set(playerId, count - 1)
    }
  }
  if (onlyPositive) {
    return votes.filter((v) => v > 0)
  }
  return votes
}

export const parseMention = (text: string): Snowflake | undefined => {
  text = text.trim()
  if (text.startsWith('<@') && text.endsWith('>')) {
    let mention = text.slice(2, -1)

    if (mention.startsWith('!')) {
      mention = mention.slice(1)
    }
    return mention
  }

  return undefined
}

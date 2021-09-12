import {
  Collection,
  Message,
  MessageEmbed,
  Snowflake,
  TextChannel,
} from 'discord.js'
import _ from 'lodash'
import { ADMIN_ID } from './game-settings'
import { gameState } from './game-state'
import { Letters, People } from './icons'
import { Player } from './player'
import { rand, sleep } from './utils'

export const muteAllDeathPlayer = async () => {
  const deathPlayers = [...gameState.deathPlayers.keys()]
  for (const deathPlayer of deathPlayers) {
    const p = gameState.findPlayer(deathPlayer)!
    await mute(p)
  }
}

export const unmute = async (player: Player) => {
  if (!player.raw.voice.serverMute) {
    await player.raw.voice.setMute(true)
  }
}
export const mute = async (player: Player) => {
  if (player.raw.voice.serverMute) {
    await player.raw.voice.setMute(false)
  }
}

export const selectRandomPlayerFromVotes = <T extends string = string>(
  votes: Collection<T, number>
): T => {
  const max = Math.max.apply(null, Array.from(votes.values()))

  return votes.filter((v) => v === max).randomKey()
}

export const checkWin = (): boolean => {
  return (
    gameState.players.some((player) => !player.isDeath && player.faction.win) ||
    gameState.alivePlayers.length === 0
  )
}

export const unmuteEveryone = async (): Promise<void> => {
  const mainVoiceChannel = gameState.mainVoiceChannels
  if (mainVoiceChannel) {
    for (const member of mainVoiceChannel.members.values()) {
      await member.voice.setMute(false)
    }
  }
}

export const sendVictoryAnnoucement = async () => {
  if (gameState.alivePlayers.length === 0) {
    gameState.otherTextChannels.get('main')?.send({
      embeds: [createRolesEmbedMessage().setTitle('Hoà ròi.')],
    })

    return
  }
  const winnedFaction = (
    gameState.alivePlayers.filter((p) => p.faction.win)[0] as Player
  ).faction

  gameState.otherTextChannels.get('main')?.send({
    embeds: [
      createRolesEmbedMessage().setTitle(winnedFaction.victoryAnnouncement),
    ],
  })
}

export const createRolesEmbedMessage = () => {
  return new MessageEmbed().setDescription(
    `${gameState.players
      .map(
        (p) =>
          `${p.raw.displayName} là ${p.originalRole.name} ${p.originalRole.icon}`
      )
      .join('\n\n')}`
  )
}

export const createVotingMessage = <T extends string = Snowflake>(
  players: Array<Player | { id: T; text: string; icon?: string }>
): { embed: MessageEmbed; map: Collection<string, T> } => {
  const embed = new MessageEmbed()
  const map = new Collection<string, T>()
  const letters = [...Letters.values()]
  let letterIndex = 0
  embed.setDescription(
    players
      .map((player) => {
        let icon: string
        if (player instanceof Player) {
          const hasCustomIcon = People.has(player.raw.id)
          if (hasCustomIcon) {
            const customIcon = People.get(player.raw.id)
            icon = (
              Array.isArray(customIcon) ? _(customIcon).sample() : customIcon
            ) as string
          } else {
            icon = letters[letterIndex++] as string
          }
          map.set(icon, player.raw.id as T)
          const stringifyIcon = hasCustomIcon ? `<:${icon}>` : icon

          return `${stringifyIcon} ${player.raw.displayName}`
        }
        if (player.icon) {
          icon = player.icon
        } else {
          icon = letters[letterIndex++] as string
        }
        map.set(icon, player.id)

        return `${icon} ${player.text}`
      })
      .join('\n\n')
  )

  return { embed, map }
}

export const sendVotingMessage = async (
  channel: TextChannel,
  embed: MessageEmbed,
  map: Collection<string, Snowflake>,
  content?: string
) => {
  const message = await channel.send({ embeds: [embed], content })
  await Promise.all(
    [...map.keys()].map((icon) => {
      message.react(icon)
    })
  )

  return message
}

export const collectVotes = async <T extends string = Snowflake>(
  message: Message,
  map: Collection<string, T>,
  {
    onlyPositive = false,
    withMayorVote = false,
  }: { onlyPositive?: boolean; withMayorVote?: boolean } = {}
) => {
  const fetched = await message.fetch(true)
  const votes: Collection<T, number> = new Collection()
  for (const [emoji, playerId] of map.entries()) {
    const isCustomEmoji = emoji.includes(':')
    const reaction = fetched.reactions.cache.find((r) => {
      return r.emoji.name === (isCustomEmoji ? emoji.split(':')[0] : emoji)
    })
    if (reaction) {
      let count = reaction.count
      if (withMayorVote) {
        const fetchedUsers = await reaction.users.fetch()
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

export const givePermission = async (channel: TextChannel, player: Player) => {
  await channel.permissionOverwrites.edit(
    player.raw,
    {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      ADD_REACTIONS: true,
    },
    {
      type: 1,
    }
  )
}

export const shouldStartMayorVoting = () => {
  return !gameState.mayorId || gameState.deathPlayers.has(gameState.mayorId)
}

export const authorizeMessage = (
  message: Message,
  allowedId: Set<string> = new Set()
) => {
  const ids = new Set([...allowedId, ADMIN_ID])
  if (gameState.controller) {
    ids.add(gameState.controller)
  }

  return ids.has(message.author.id)
}

export const fetchReactionUsers = async (message: Message, emoji: string) => {
  const isCustomEmoji = emoji.includes(':')
  const reaction = message.reactions.cache.find(
    (r) => r.emoji.name === (isCustomEmoji ? emoji.split(':')[0] : emoji)
  )
  if (reaction) {
    return reaction.users.fetch()
  }

  return undefined
}

export const sendCannotUseAbilityReason = async (player: Player) => {
  if (player.isEffectedByCave) {
    await player.role.channel.send(`${player} bạn bị yếu ròi nha.`)
  }
}

export const fakeDelay = async () => {
  await sleep(1000 * rand(20, 30))
}

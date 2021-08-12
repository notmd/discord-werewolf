import { MessageReaction, PartialMessageReaction } from 'discord.js'
import { RoleIds } from './game-settings'
import { gameState } from './game-state'
import { Thumbsup } from './icons'

export class VotingHandler {
  constructor(private reaction: MessageReaction | PartialMessageReaction) {}
  handle() {
    if (gameState.isRunning || this.reaction.emoji.name !== Thumbsup) return
    if (
      this.reaction.message.channel.id ===
      gameState.findTextChannelByRole(RoleIds.WereWolf)?.id
    ) {
    }
  }

  // async ensureNotDuplicatVoteWereWolf() {
  //   const reactionAuthors = this.reaction.users.cache.filter(r => )
  //   for (const message of gameState.wereWoflVotingMessages) {
  //     if (message.id !== this.reaction.message.id) {
  //       const oldThumbsupReactions = message.reactions.cache.find(
  //         (r) => r.emoji.name === Thumbsup
  //       )
  //       // const user = await (await oldThumbsupReactions?.users.fetch()).find(u => u.id && )
  //       // if (users) {
  //       //   for (const user of this.reaction.users.cache.values()) {
  //       //     if (users.has(user.id)) {
  //       //       // remove old reaction
  //       //       message.reactions.cache.find(r =>)
  //       //     }
  //       //   }
  //       // }
  //     }
  //   }
  // }
}

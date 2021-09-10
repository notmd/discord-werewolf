import { TextChannel } from 'discord.js'
import { IFaction } from '../faction/faction.interface'
import { Role } from '../game-settings'

export interface IRole {
  readonly id: Role
  readonly name: string
  readonly roomName?: Role | Role[]
  readonly faction: IFaction // this should be access only from the Player class as default faction
  readonly icon: string
  readonly channel: TextChannel

  is(role: Role): boolean

  in(roles: Role[] | Readonly<Role[]>): boolean

  onSleep?: () => Promise<void>

  onWakeUp?: () => Promise<void>

  // canBeKill(context: KillContext): boolean
}

import { IFaction } from '../faction/faction.interface'
import { Role } from '../game-settings'
import { Player } from '../player'

export interface IRole {
  readonly id: Role
  readonly name: string
  readonly roleAssignedNotification: boolean
  readonly roomName?: Role
  readonly faction: IFaction // this should be access only from the Player class as default faction
  readonly icon: string
  is(role: Role): boolean

  kill(player: Player | string): void

  onSleep?: () => void

  onBeforeWakeup?: () => void

  // canBeKill(context: KillContext): boolean
}

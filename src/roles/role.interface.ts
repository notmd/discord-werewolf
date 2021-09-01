import { IFaction } from '../faction/faction.interface'
import { Role } from '../game-settings'

export interface IRole {
  readonly id: Role
  readonly name: string
  readonly roleAssignedNotification: boolean
  readonly roomName?: Role | Role[]
  readonly faction: IFaction // this should be access only from the Player class as default faction
  readonly icon: string

  is(role: Role): boolean

  in(roles: Role[] | Readonly<Role[]>): boolean

  onSleep?: () => void

  onBeforeWakeUp?: () => void

  // canBeKill(context: KillContext): boolean
}

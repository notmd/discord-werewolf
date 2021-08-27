import { Role } from '../game-settings'
import { Player } from '../player'

export interface IRole {
  readonly id: Role
  readonly name: string
  readonly roleAssignedNotification: boolean
  readonly roomName?: Role
  readonly faction: 'village' | 'wolf'
  readonly icon: string
  is(role: Role): boolean

  kill(player: Player | string): void

  onSleep?: () => void
}

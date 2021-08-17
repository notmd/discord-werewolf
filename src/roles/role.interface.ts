import { RoleIds } from '../game-settings'
import { Player } from '../player'

export interface IRole {
  readonly id: RoleIds
  readonly name: string
  readonly roleAssignedNotification: boolean
  readonly roomName?: RoleIds
  readonly faction: 'village' | 'wolf'

  is(role: RoleIds): boolean

  kill(player: Player | string): void

  cleanUpState(): void
}

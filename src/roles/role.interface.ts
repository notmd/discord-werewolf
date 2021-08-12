import { RoleIds } from '../game-settings'

export interface IRole {
  readonly id: RoleIds
  readonly name: string
  readonly roleAssignedNotification: boolean
  readonly roomName?: string
  readonly faction: 'village' | 'wolf'
}

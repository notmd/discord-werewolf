import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Hunter extends BaseRole implements IRole {
  readonly id = Role.Hunter
  readonly name = 'Thợ săn'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Hunter
  readonly faction = new VillageFaction()
  readonly icon = '🔫'
}

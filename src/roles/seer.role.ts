import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Seer extends BaseRole implements IRole {
  readonly id = Role.Seer
  readonly name = 'Tiên tri'
  readonly roleAssignedNotification = true
  readonly roomName = Role.Seer
  readonly faction = new VillageFaction()
  readonly icon = '👀'
}

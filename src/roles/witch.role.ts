import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Witch extends BaseRole implements IRole {
  readonly id = Role.Witch
  readonly name = 'Phù thủy'
  readonly faction = new VillageFaction()
  readonly roomName = Role.Witch
  readonly icon = '🧙‍♀️'
}

import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Villager extends BaseRole implements IRole {
  readonly id = Role.Villager
  readonly name = 'Dân làng'
  readonly roomName = undefined
  readonly faction = new VillageFaction()
  readonly icon = '👷'
}

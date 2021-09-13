import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Villager extends BaseRole implements IRole {
  readonly id = Role.Villager
  readonly name = 'Dân làng'
  readonly channelNames = undefined
  readonly faction = new VillagerFaction()
  readonly icon = '👷'
}

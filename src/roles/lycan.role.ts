import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Lycan extends BaseRole implements IRole {
  readonly id = Role.Lycan
  readonly name = 'Lycan'
  readonly channelNames = Role.Lycan
  readonly faction = new VillagerFaction()
  readonly icon = '🐺👷'
}

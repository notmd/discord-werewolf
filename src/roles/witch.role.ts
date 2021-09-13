import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Witch extends BaseRole implements IRole {
  readonly id = Role.Witch
  readonly name = 'Phù thủy'
  readonly faction = new VillagerFaction()
  readonly channelNames = Role.Witch
  readonly icon = '🧙‍♀️'
}

import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Hunter extends BaseRole implements IRole {
  readonly id = Role.Hunter
  readonly name = 'Thợ săn'
  readonly faction = new VillagerFaction()
  readonly roomName = Role.Hunter
  readonly icon = '🔫'
}

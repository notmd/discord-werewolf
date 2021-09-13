import { VillagerFaction } from '../faction/villager.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Cupid extends BaseRole implements IRole {
  readonly id = Role.Cupid
  readonly name = 'Cupid'
  readonly roleAssignedNotification = true
  readonly channelNames = Role.Cupid
  readonly faction = new VillagerFaction()
  readonly icon = '💘'
}

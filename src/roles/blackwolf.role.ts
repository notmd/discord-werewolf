import { WolfFaction } from '../faction/wolf.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class BlackWolf extends BaseRole implements IRole {
  readonly id = Role.BlackWolf
  readonly name = 'Sói Nguyền'
  readonly roleAssignedNotification = true
  readonly roomName = [Role.WereWolf, Role.BlackWolf]
  readonly faction = new WolfFaction()
  readonly icon = '🐺'
}

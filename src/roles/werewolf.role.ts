import { WolfFaction } from '../faction/wolf.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class WereWolf extends BaseRole implements IRole {
  readonly id = Role.WereWolf
  readonly name = 'Sói'
  readonly roomName = Role.WereWolf
  readonly faction = new WolfFaction()
  readonly icon = '🐺'
}

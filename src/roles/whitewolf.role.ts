import { WhiteWolfFaction } from '../faction/whitewolf.faction'
import { Role } from '../game-settings'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class WhiteWolf extends BaseRole implements IRole {
  readonly id = Role.WhiteWolf
  readonly name = 'Sói Trắng'
  readonly roomName = [Role.WereWolf, Role.WhiteWolf]
  readonly faction = new WhiteWolfFaction()
  readonly icon = '🐺'
}

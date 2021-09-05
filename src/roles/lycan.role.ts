import { VillageFaction } from '../faction/village.faction'
import { Role } from '../game-settings'
import { Player } from '../player'
import { BaseRole } from './base-role.abstract'
import { IRole } from './role.interface'

export class Lycan extends BaseRole implements IRole {
  readonly id = Role.Lycan
  readonly name = 'Lycan'
  readonly roomName = Role.Lycan
  readonly faction = new VillageFaction()
  readonly icon = '🐺👷'

  kill(_player: Player | string) {
    throw new Error('Lycan can not kill anyone.')
  }
}

import { BlackWolf } from './roles/blackwolf.role'
import { BodyGuard } from './roles/body-guard.role'
import { Cupid } from './roles/cupid.role'
import { Hunter } from './roles/hunter.role'
import { Lycan } from './roles/lycan.role'
import { IRole } from './roles/role.interface'
import { Seer } from './roles/seer.role'
import { Villager } from './roles/villager.role'
import { WereWolf } from './roles/werewolf.role'
import { WhiteWolf } from './roles/whitewolf.role'
import { Witch } from './roles/witch.role'

export const ADMIN_ID = '621326534803849218'
export const MAIN_VOICE_CHANNLE = 'main'
export const MAIN_TEXT_CHANNEL = 'text-main'
export const CHANNEL_NAME_PREFIX = 'ww_'
export const COMMAND_PREFIX = '!ww'
export enum Role {
  WereWolf = 'werewolf',
  Villager = 'villager',
  Seer = 'seer',
  BodyGuard = 'bodyguard',
  Witch = 'witch',
  Hunter = 'hunter',
  Lycan = 'lycan',
  Mayor = 'mayor',
  Cupid = 'cupid',
  Couple = 'couple',
  BlackWolf = 'blackwolf',
  WhiteWolf = 'whitewolf',
}
export const WOLFS = [Role.WereWolf, Role.BlackWolf, Role.WhiteWolf] as const

type GameSettings = {
  readonly roles: Map<Role, IRole>
  readonly channels: Map<
    string | Role,
    {
      visibility: 'public' | 'private'
      type: 'GUILD_TEXT' | 'GUILD_VOICE'
    }
  >
}

export const gameSettings: GameSettings = {
  // @ts-expect-error
  roles: new Map([
    [Role.WereWolf, new WereWolf()],
    [Role.Villager, new Villager()],
    [Role.Seer, new Seer()],
    [Role.BodyGuard, new BodyGuard()],
    [Role.Witch, new Witch()],
    [Role.Hunter, new Hunter()],
    [Role.Lycan, new Lycan()],
    [Role.Cupid, new Cupid()],
    [Role.BlackWolf, new BlackWolf()],
    [Role.WhiteWolf, new WhiteWolf()],
  ]),
  channels: new Map([
    [MAIN_VOICE_CHANNLE, { visibility: 'public', type: 'GUILD_VOICE' }],
    [MAIN_TEXT_CHANNEL, { visibility: 'public', type: 'GUILD_TEXT' }],
    [Role.WereWolf, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Seer, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.BodyGuard, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Witch, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Hunter, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Lycan, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Mayor, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Cupid, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Couple, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.BlackWolf, { visibility: 'private', type: 'GUILD_TEXT' }],
  ]),
} as const

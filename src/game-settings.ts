import { BodyGuard } from './roles/body-guard.role'
import { Hunter } from './roles/hunter.role'
import { IRole } from './roles/role.interface'
import { Seer } from './roles/seer.role'
import { Villager } from './roles/villager.role'
import { WereWolf } from './roles/werewolf.role'
import { Witch } from './roles/witch.role'
export const MAIN_VOICE_CHANNLE = 'main'
export const MAIN_TEXT_CHANNEL = 'text-main'
export const DEATH_VOICE_CHANNLE = 'death'
export const CHANNEL_NAME_PREFIX = 'ww_'
export const COMMAND_PREFIX = '!ww'
export enum Role {
  WereWolf = 'werewolf',
  Villager = 'villager',
  Seer = 'seer',
  BodyGuard = 'bodyguard',
  Witch = 'witch',
  Hunter = 'hunter',
}

type GameSettings = {
  readonly roles: Map<Role | typeof Role, IRole>
  readonly channels: Map<
    // | typeof MAIN_VOICE_CHANNLE
    // | typeof MAIN_TEXT_CHANNEL
    // | typeof DEATH_VOICE_CHANNLE
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
  ]),
  channels: new Map([
    [MAIN_VOICE_CHANNLE, { visibility: 'public', type: 'GUILD_VOICE' }],
    [DEATH_VOICE_CHANNLE, { visibility: 'public', type: 'GUILD_VOICE' }],
    [MAIN_TEXT_CHANNEL, { visibility: 'public', type: 'GUILD_TEXT' }],
    [Role.WereWolf, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Seer, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.BodyGuard, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Witch, { visibility: 'private', type: 'GUILD_TEXT' }],
    [Role.Hunter, { visibility: 'private', type: 'GUILD_TEXT' }],
  ]),
} as const

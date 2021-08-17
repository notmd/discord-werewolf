import { BodyGuard } from './roles/body-guard.role'
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
export enum RoleIds {
  WereWolf = 'werewolf',
  Villager = 'villager',
  Seer = 'seer',
  BodyGuard = 'bodyguard',
  Witch = 'witch',
}

type GameSettings = {
  readonly roles: Map<RoleIds | typeof RoleIds, IRole>
  readonly channels: Map<
    // | typeof MAIN_VOICE_CHANNLE
    // | typeof MAIN_TEXT_CHANNEL
    // | typeof DEATH_VOICE_CHANNLE
    string | RoleIds,
    {
      visibility: 'public' | 'private'
      type: 'GUILD_TEXT' | 'GUILD_VOICE'
    }
  >
}

export const gameSettings: GameSettings = {
  // @ts-expect-error
  roles: new Map([
    [RoleIds.WereWolf, new WereWolf()],
    [RoleIds.Villager, new Villager()],
    [RoleIds.Seer, new Seer()],
    [RoleIds.BodyGuard, new BodyGuard()],
    [RoleIds.Witch, new Witch()],
  ]),
  channels: new Map([
    [MAIN_VOICE_CHANNLE, { visibility: 'public', type: 'GUILD_VOICE' }],
    [DEATH_VOICE_CHANNLE, { visibility: 'public', type: 'GUILD_VOICE' }],
    [MAIN_TEXT_CHANNEL, { visibility: 'public', type: 'GUILD_TEXT' }],
    [RoleIds.WereWolf, { visibility: 'private', type: 'GUILD_TEXT' }],
    [RoleIds.Seer, { visibility: 'private', type: 'GUILD_TEXT' }],
    [RoleIds.BodyGuard, { visibility: 'private', type: 'GUILD_TEXT' }],
    [RoleIds.Witch, { visibility: 'private', type: 'GUILD_TEXT' }],
  ]),
} as const

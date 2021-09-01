import { Role } from '../game-settings'

export abstract class BaseRole {
  abstract readonly id: Role
  is(role: Role): boolean {
    return this.id === role
  }
  in(roles: Role[] | Readonly<Role[]>): boolean {
    return roles.some((role) => role === this.id)
  }
}

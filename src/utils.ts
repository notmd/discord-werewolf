import { ITurn } from './turns/turn'

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isTurn = (val: unknown): val is ITurn => {
  // @ts-expect-error
  return !!val?.__is_turn === true
}

import { IStep } from './steps/step'

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isStep = (val: unknown): val is IStep => {
  // @ts-expect-error
  return val.__is_step === true
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

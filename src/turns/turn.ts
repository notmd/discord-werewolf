export interface ITurn {
  handle(): Promise<ITurn | null>
  readonly __is_turn: true
}

export interface ITurnConstrucable extends ITurn {
  new (): ITurn
}

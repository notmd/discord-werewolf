export interface IStep {
  handle(): Promise<IStep | null>
  readonly __is_step: true
}

// export interface ITurnConstrucable extends ITurn {
//   new (): ITurn
// }

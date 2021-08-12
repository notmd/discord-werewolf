export interface IStep {
  handle(): Promise<IStep | null>
  readonly __is_step: true
}

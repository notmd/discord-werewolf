export interface IStep {
  handle(): Promise<any>
  readonly __is_step: true
}

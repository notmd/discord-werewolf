export interface IStep {
  handle(): Promise<undefined | IStep>
}

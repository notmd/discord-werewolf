export interface IStep {
  handle(): Promise<undefined | IStep>
  readonly allowedId?: Set<string>
}

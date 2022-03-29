export class MissingParamsError extends Error {
  constructor (parameters: string[]) {
    super(`Parameters are missing: [${parameters.join(', ')}]`)
    this.name = MissingParamsError.name
  }
}

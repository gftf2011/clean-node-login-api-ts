export class MissingHeaderParamsError extends Error {
  constructor (parameters: string[]) {
    super(`Header parameters are missing: [${parameters.join(', ')}]`)
    this.name = MissingHeaderParamsError.name
  }
}

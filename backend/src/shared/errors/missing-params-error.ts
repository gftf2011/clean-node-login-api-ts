import { Error400 } from './error-400'

export class MissingParamsError extends Error400 {
  constructor (parameters: string[]) {
    super(`Parameters are missing: [${parameters.join(', ')}]`)
    this.name = MissingParamsError.name
  }
}

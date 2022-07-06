import { Error400 } from './error-400'

export class InvalidNameError extends Error400 {
  constructor(name: string) {
    super(`The name '${name}' is not valid`)
    this.name = InvalidNameError.name
  }
}

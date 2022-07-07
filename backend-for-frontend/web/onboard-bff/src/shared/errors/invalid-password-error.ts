import { Error400 } from './error-400'

export class InvalidPasswordError extends Error400 {
  constructor(password: string) {
    super(`The password '${password}' is too weak`)
    this.name = InvalidPasswordError.name
  }
}

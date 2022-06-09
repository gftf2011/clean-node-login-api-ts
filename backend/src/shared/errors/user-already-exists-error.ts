import { Error403 } from './error-403'

export class UserAlreadyExistsError extends Error403 {
  constructor () {
    super('The user already exists')
    this.name = UserAlreadyExistsError.name
  }
}

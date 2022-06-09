import { Error400 } from './error-400'

export class InvalidRefreshTokenExpirationError extends Error400 {
  constructor () {
    super('The refresh token expiration time was set incorrectly')
    this.name = InvalidRefreshTokenExpirationError.name
  }
}

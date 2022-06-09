import { Error400 } from './error-400'

export class InvalidRefreshTokenDurationError extends Error400 {
  constructor () {
    super('The refresh token duration was set incorrectly')
    this.name = InvalidRefreshTokenDurationError.name
  }
}

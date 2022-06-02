import { Error400 } from './error-400'

export class InvalidRefreshTokenIdError extends Error400 {
  constructor (id: string) {
    super(`The refresh token id: ${id} was set incorrectly`)
    this.name = InvalidRefreshTokenIdError.name
  }
}

/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { InvalidRefreshTokenDurationError, InvalidRefreshTokenExpirationError } from '@/shared/errors'

export class RefreshTokenEntity {
  private readonly expiresIn: number
  private readonly duration: number

  private constructor (expiresIn: number, duration: number) {
    this.expiresIn = expiresIn
    this.duration = duration
    Object.freeze(this)
  }

  getExpiresIn (): number {
    return this.expiresIn
  }

  getDuration (): number {
    return this.duration
  }

  private static validateDuration (duration: number): boolean {
    if (!duration) {
      return false
    }

    if (duration <= 0) {
      return false
    }

    return true
  }

  private static validateExpiresIn (expiresIn: number): boolean {
    if (!expiresIn) {
      return false
    }

    if (expiresIn <= 0) {
      return false
    }

    return true
  }

  private static validate (expiresIn: number, duration: number): Either<Error, true> {
    if (!RefreshTokenEntity.validateExpiresIn(expiresIn)) {
      return left(new InvalidRefreshTokenExpirationError())
    }
    if (!RefreshTokenEntity.validateDuration(duration)) {
      return left(new InvalidRefreshTokenDurationError())
    }
    return right(true)
  }

  static create (expiresIn: number, duration: number): Either<Error, RefreshTokenEntity> {
    const either = RefreshTokenEntity.validate(expiresIn, duration)
    if (either.isRight()) {
      return right(new RefreshTokenEntity(expiresIn + duration, duration))
    }
    return left(either.value)
  }
}

/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { InvalidRefreshTokenDurationError, InvalidRefreshTokenExpirationError, InvalidRefreshTokenIdError } from '@/shared/errors'
import { createUUID, validateUUID } from '@/shared/utils'

export class RefreshTokenEntity {
  private readonly id: string
  private readonly expiresIn: number
  private readonly duration: number

  private constructor (id: string, expiresIn: number, duration: number) {
    this.id = id
    this.expiresIn = expiresIn
    this.duration = duration
    Object.freeze(this)
  }

  getId (): string {
    return this.id
  }

  getExpiresIn (): number {
    return this.expiresIn
  }

  getDuration (): number {
    return this.duration
  }

  private static validateUUID (uuid: string): boolean {
    return validateUUID(uuid)
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

  private static validate (id: string, expiresIn: number, duration: number): Either<Error, true> {
    if (!RefreshTokenEntity.validateUUID(id)) {
      return left(new InvalidRefreshTokenIdError(id))
    }
    if (!RefreshTokenEntity.validateExpiresIn(expiresIn)) {
      return left(new InvalidRefreshTokenExpirationError())
    }
    if (!RefreshTokenEntity.validateDuration(duration)) {
      return left(new InvalidRefreshTokenDurationError())
    }
    return right(true)
  }

  static create (expiresIn: number, duration: number): Either<Error, RefreshTokenEntity> {
    const uuid = createUUID()
    const either = RefreshTokenEntity.validate(uuid, expiresIn, duration)
    if (either.isRight()) {
      return right(new RefreshTokenEntity(uuid, expiresIn + duration, duration))
    }
    return left(either.value)
  }
}

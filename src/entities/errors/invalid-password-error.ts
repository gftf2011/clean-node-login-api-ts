import { IDomainError } from '@/entities/errors/domain-error'

export class InvalidPasswordError extends Error implements IDomainError {
  constructor (password: string) {
    super(`The password '${password}' is too weak`)
    this.name = InvalidPasswordError.name
  }
}

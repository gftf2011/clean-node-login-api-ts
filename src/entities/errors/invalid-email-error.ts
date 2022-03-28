import { IDomainError } from '@/entities/errors/domain-error'

export class InvalidEmailError extends Error implements IDomainError {
  constructor (email: string) {
    super(`The email '${email}' is not valid`)
    this.name = InvalidEmailError.name
  }
}

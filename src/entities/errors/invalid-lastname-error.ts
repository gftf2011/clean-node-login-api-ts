import { IDomainError } from '@/entities/errors/domain-error'

export class InvalidLastnameError extends Error implements IDomainError {
  constructor (lastname: string) {
    super(`The lastname '${lastname}' is not valid`)
    this.name = InvalidLastnameError.name
  }
}

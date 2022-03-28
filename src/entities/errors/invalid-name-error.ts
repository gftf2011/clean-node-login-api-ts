import { IDomainError } from '@/entities/errors/domain-error'

export class InvalidNameError extends Error implements IDomainError {
  constructor (name: string) {
    super(`The name '${name}' is not valid`)
    this.name = InvalidNameError.name
  }
}

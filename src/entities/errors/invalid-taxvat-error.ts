import { IDomainError } from '@/entities/errors/domain-error'

export class InvalidTaxvatError extends Error implements IDomainError {
  constructor (taxvat: string) {
    super(`The taxvat '${taxvat}' is not valid`)
    this.name = InvalidTaxvatError.name
  }
}

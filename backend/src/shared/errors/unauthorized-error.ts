import { Error401 } from './error-401'

export class UnauthorizedError extends Error401 {
  constructor() {
    super('Unauthorized to access resource')
    this.name = UnauthorizedError.name
  }
}

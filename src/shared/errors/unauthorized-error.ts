export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized to access resource')
    this.name = UnauthorizedError.name
  }
}

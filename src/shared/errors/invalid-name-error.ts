export class InvalidNameError extends Error {
  constructor (name: string) {
    super(`The name '${name}' is not valid`)
    this.name = InvalidNameError.name
  }
}

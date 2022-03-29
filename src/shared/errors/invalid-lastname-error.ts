export class InvalidLastnameError extends Error {
  constructor (lastname: string) {
    super(`The lastname '${lastname}' is not valid`)
    this.name = InvalidLastnameError.name
  }
}

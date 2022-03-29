export class InvalidEmailError extends Error {
  constructor (email: string) {
    super(`The email '${email}' is not valid`)
    this.name = InvalidEmailError.name
  }
}

export class InvalidPasswordError extends Error {
  constructor (password: string) {
    super(`The password '${password}' is too weak`)
    this.name = InvalidPasswordError.name
  }
}

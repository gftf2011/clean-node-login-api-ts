export class ServerError extends Error {
  constructor () {
    super('Server is not responding')
    this.name = ServerError.name
  }
}

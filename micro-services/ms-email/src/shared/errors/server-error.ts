import { Error500 } from './error-500'

export class ServerError extends Error500 {
  constructor() {
    super('Server is not responding')
    this.name = ServerError.name
  }
}

import { Error500 } from './error-500'

export class MailServiceError extends Error500 {
  constructor () {
    super('Mail service error')
    this.name = 'MailServiceError'
  }
}

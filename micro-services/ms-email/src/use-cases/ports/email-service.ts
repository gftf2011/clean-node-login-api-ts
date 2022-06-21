/**
 * Shared
 */
import { Either } from '../../shared/either'

export interface EmailOptions {
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly html: string
}

export interface EmailService {
  send: (options: EmailOptions) => Promise<Either<Error, any>>
}

/**
 * Shared
 */
import { Either } from '../../shared/either'

export interface EmailOptions {
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html: string
  readonly attachments: Object[]
}

export interface EmailService {
  send: (options: EmailOptions) => Promise<Either<Error, EmailOptions>>
}

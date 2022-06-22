/**
 * Shared
 */
import { Either } from '../../shared/either'

export interface EmailOptions {
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly html: string
  readonly attachments?: object[]
}

export interface EmailTemplate {
  html: (data: object) => string
  attachments: () => object[]
}

export interface EmailService {
  send: (
    accessToken: string,
    options: EmailOptions
  ) => Promise<Either<Error, any>>
}

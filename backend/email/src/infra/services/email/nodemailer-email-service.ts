/**
 * Driver
 */
import * as nodemailer from 'nodemailer'

/**
 * Shared
 */
import { Either, left, right } from '../../../shared'

/**
 * Use Cases
 */
import { EmailOptions, EmailService } from '../../../use-cases/ports'

/**
 * Shared
 */
import { MailServiceError } from '../../../shared/errors'

export class NodemailerEmailService implements EmailService {
  async send(
    accessToken: string,
    options: EmailOptions
  ): Promise<Either<Error, any>> {
    const { from, to, subject, html } = options

    const clientId = process.env.NODEMAILER_OAUTH_CLIENT_ID
    const clientSecret = process.env.NODEMAILER_OAUTH_CLIENT_SECRET

    try {
      const transporter = nodemailer.createTransport({
        port: +process.env.NODEMAILER_PORT,
        host: process.env.NODEMAILER_HOST,
        secure: true,
        auth: {
          clientId,
          clientSecret,
          user: process.env.NODEMAILER_USER,
          accessToken,
          refreshToken: process.env.NODEMAILER_OAUTH_REFRESH_TOKEN,
          type: 'OAuth2',
        },
      })

      const response = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      })
      return right(response)
    } catch (error) {
      return left(new MailServiceError())
    }
  }
}

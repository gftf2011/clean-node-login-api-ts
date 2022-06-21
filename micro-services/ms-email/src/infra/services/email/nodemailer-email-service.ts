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
 * Driver
 */
import { google } from 'googleapis'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<Error, any>> {
    try {
      const { from, to, subject, html } = options

      const clientId = process.env.NODEMAILER_OAUTH_CLIENT_ID
      const clientSecret = process.env.NODEMAILER_OAUTH_CLIENT_SECRET
      const redirectUri = process.env.NODEMAILER_OAUTH_REDIRECT_URL

      const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

      oAuth2Client.setCredentials({
        refresh_token: process.env.NODEMAILER_OAUTH_REFRESH_TOKEN
      })

      const accessToken = await oAuth2Client.getAccessToken()

      const transporter = nodemailer.createTransport({
        port: +process.env.NODEMAILER_PORT,
        host: process.env.NODEMAILER_HOST,
        secure: true,
        auth: {
          clientId,
          clientSecret,
          user: process.env.NODEMAILER_USER,
          accessToken: accessToken.token,
          refreshToken: process.env.NODEMAILER_OAUTH_REFRESH_TOKEN,
          type: 'OAuth2'
        }
      })

      const response = await transporter.sendMail({
        from,
        to,
        subject,
        html
      })
      return right(response)
    } catch (error) {
      return left(error as Error)
    }
  }
}

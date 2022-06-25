/**
 * Use Cases
 */
import {
  BasicUserDto,
  EmailOptions,
  EmailService,
  EmailTemplate,
  IWelcomeEmailUseCase,
  OAuth2Service,
} from './ports'

/**
 * Shared
 */
import { Either, left, right } from '../shared'
import { ServerError } from '../shared/errors'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to send an email after user sign up
 */
export class WelcomeEmailUseCase implements IWelcomeEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailTemplate: EmailTemplate,
    private readonly oAuthService: OAuth2Service
  ) {}

  /**
   * @desc Performs the main logic to send the user`s welcoming email
   * @param {BasicUserDto} request - user data from input
   * @returns {Promise<Either<Error, any>>} output from email service response
   */
  async perform(request: BasicUserDto): Promise<Either<Error, any>> {
    if (
      !process.env.NODEMAILER_OAUTH_CLIENT_ID ||
      !process.env.NODEMAILER_OAUTH_CLIENT_SECRET ||
      !process.env.NODEMAILER_OAUTH_REDIRECT_URL ||
      !process.env.NODEMAILER_OAUTH_REFRESH_TOKEN
    ) {
      return left(new ServerError())
    }

    const clientId = process.env.NODEMAILER_OAUTH_CLIENT_ID
    const clientSecret = process.env.NODEMAILER_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.NODEMAILER_OAUTH_REDIRECT_URL
    const refreshToken = process.env.NODEMAILER_OAUTH_REFRESH_TOKEN

    const accessToken = await this.oAuthService.getAccessToken(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken
    )

    const mailOptions: EmailOptions = {
      from: 'Gabriel Ferrari Tarallo Ferraz | Acme <noreply@acme.com>',
      to: request.email,
      subject: 'Welcome to Acme!',
      html: this.emailTemplate.html(request),
      attachments: this.emailTemplate.attachments(),
    }
    const response = await this.emailService.send(accessToken, mailOptions)
    return right(response)
  }
}

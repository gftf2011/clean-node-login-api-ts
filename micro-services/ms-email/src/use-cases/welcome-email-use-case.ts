/**
 * Use Cases
 */
import {
  EmailOptions,
  EmailService,
  EmailTemplate,
  IWelcomeEmailUseCase,
  OAuth2Service,
  UserDto,
} from './ports'

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

  async perform(request: UserDto): Promise<void> {
    if (
      !process.env.NODEMAILER_OAUTH_CLIENT_ID ||
      !process.env.NODEMAILER_OAUTH_CLIENT_SECRET ||
      !process.env.NODEMAILER_OAUTH_REDIRECT_URL ||
      !process.env.NODEMAILER_OAUTH_REFRESH_TOKEN
    ) {
      return
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
    await this.emailService.send(accessToken, mailOptions)
  }
}

/**
 * Use Cases
 */
import { EmailOptions, EmailService, EmailTemplate, IWelcomeEmailUseCase, UserDto } from './ports'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to send an email after user sign up
 */
export class WelcomeEmailUseCase implements IWelcomeEmailUseCase {
  constructor (
    private readonly emailService: EmailService,
    private readonly emailTemplate: EmailTemplate
  ) {}

  async perform (request: UserDto): Promise<void> {
    const mailOptions: EmailOptions = {
      from: 'Gabriel Ferrari Tarallo Ferraz | Acme <noreply@acme.com>',
      to: request.email,
      subject: 'Welcome to Acme!',
      html: this.emailTemplate.html(request),
      attachments: this.emailTemplate.attachments()
    }
    await this.emailService.send(mailOptions)
  }
}

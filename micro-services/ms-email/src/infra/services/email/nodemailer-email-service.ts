/**
 * Shared
 */
import { Either, left, right } from '../../../shared'

/**
 * Use Cases
 */
import { EmailOptions, EmailService } from '../../../use-cases/ports'

/**
 * Infra
 */
import { EmailDirector } from './helpers/builders/email-director'
import { NodemailerTransporterBuilder } from './helpers/builders/nodemailer-builder'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<Error, EmailOptions>> {
    try {
      const { from, to, subject, text, html, attachments } = options

      const builder = new NodemailerTransporterBuilder()

      const director = new EmailDirector()
      director.setBuilder(builder)

      const transporter = director.getEmailTransporter()

      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        attachments
      })
      return right(options)
    } catch (error) {
      return left(error as Error)
    }
  }
}

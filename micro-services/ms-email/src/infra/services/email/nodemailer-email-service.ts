/**
 * Driver
 */
import * as nodemailer from 'nodemailer'

/**
 * Use Cases
 */
import { EmailOptions, EmailService } from '../../../use-cases/ports'

/**
 * Shared
 */
import { Either } from '../../../shared'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<Error, EmailOptions>> {
    const transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      auth: {
        user: options.username,
        pass: options.password
      }
    })
    await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    })
    return {} as any
  }
}

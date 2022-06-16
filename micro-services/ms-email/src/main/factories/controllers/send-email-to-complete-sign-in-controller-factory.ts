/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'

/**
 * Presentation
 */
import { SendEmailToCompleteSignInController } from '../../../presentation/controllers'

export const makeSendEmailToCompleteSignInController = (): Controller => {
  const sendEmailToCompleteSignInController = new SendEmailToCompleteSignInController()

  return sendEmailToCompleteSignInController
}

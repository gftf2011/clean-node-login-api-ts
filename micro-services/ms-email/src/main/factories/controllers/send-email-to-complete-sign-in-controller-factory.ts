/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'
import { SendEmailToCompleteSignInController } from '../../../presentation/controllers'

/**
 * Use Cases
 */
import { SendEmailToCompleteSignInUseCase } from '../../../use-cases'

export const makeSendEmailToCompleteSignInController = (): Controller => {
  const sendEmailToCompleteSignInUseCase = new SendEmailToCompleteSignInUseCase()

  const sendEmailToCompleteSignInController = new SendEmailToCompleteSignInController(
    sendEmailToCompleteSignInUseCase
  )

  return sendEmailToCompleteSignInController
}

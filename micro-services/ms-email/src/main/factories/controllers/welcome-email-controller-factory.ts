/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'

/**
 * Infra
 */
import { NodemailerEmailService } from '../../../infra/services'

/**
 * Presentation
 */
import { WelcomeEmailController } from '../../../presentation/controllers'

/**
 * Use Cases
 */
import { WelcomeEmailUseCase } from '../../../use-cases'

export const makeSendWelcomeEmailController = (): Controller => {
  const nodemailerEmailService = new NodemailerEmailService()

  const welcomeEmailUseCase = new WelcomeEmailUseCase(nodemailerEmailService)

  const welcomeEmailController = new WelcomeEmailController(
    welcomeEmailUseCase
  )

  return welcomeEmailController
}

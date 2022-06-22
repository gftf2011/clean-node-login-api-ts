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
 * Infra
 */
import { WelcomeEmailTemplate } from '../../../infra/templates'

/**
 * Use Cases
 */
import { WelcomeEmailUseCase } from '../../../use-cases'

export const makeSendWelcomeEmailController = (): Controller => {
  const welcomeEmailTemplate = new WelcomeEmailTemplate()

  const nodemailerEmailService = new NodemailerEmailService()

  const welcomeEmailUseCase = new WelcomeEmailUseCase(nodemailerEmailService, welcomeEmailTemplate)

  const welcomeEmailController = new WelcomeEmailController(
    welcomeEmailUseCase
  )

  return welcomeEmailController
}

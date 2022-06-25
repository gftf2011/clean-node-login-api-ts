/**
 * Infra
 */
import {
  GoogleOAuth2Service,
  NodemailerEmailService,
} from '../../../infra/services'

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'

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

  const googleOAuth2Service = new GoogleOAuth2Service()

  const welcomeEmailUseCase = new WelcomeEmailUseCase(
    nodemailerEmailService,
    welcomeEmailTemplate,
    googleOAuth2Service
  )

  const welcomeEmailController = new WelcomeEmailController(welcomeEmailUseCase)

  return welcomeEmailController
}

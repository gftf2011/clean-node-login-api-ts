/**
 * Infra
 */
import { AxiosHttpAuthService } from '../../../infra/services'

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'
import { SignInController } from '../../../presentation/controllers'

/**
 * Use Cases
 */
import { SignInUseCase } from '../../../use-cases'

export const makeSignInController = (): Controller => {
  const axiosHttpAuthService = new AxiosHttpAuthService()

  const signInUseCase = new SignInUseCase(axiosHttpAuthService)

  const signInController = new SignInController(signInUseCase)

  return signInController
}

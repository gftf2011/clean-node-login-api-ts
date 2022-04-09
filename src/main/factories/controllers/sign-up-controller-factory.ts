/**
 * Use Cases
 */
import { SignUpUseCase } from '@/use-cases/sign-up-use-case'

/**
 * Presentation
 */
import { WebController, SignUpController } from '@/presentation/controllers'

/**
 * Infrastructure
 */
import { CryptoTokenService } from '@/infra/services'
import { UserRepository } from '@/infra/repositories/user-repository'
import { UserDao } from '@/infra/dao/user-dao'
import { Postgres } from '@/infra/db'

export const makeSignUpController = (): WebController => {
  const postgresDb = Postgres

  const userDao = new UserDao(postgresDb.connect())
  const userRepository = new UserRepository(userDao)

  const cryptoTokenService = new CryptoTokenService()

  const signUpUseCase = new SignUpUseCase(userRepository, cryptoTokenService)

  const signUpController = new SignUpController(signUpUseCase)
  const controller = new WebController(signUpController)

  return controller
}

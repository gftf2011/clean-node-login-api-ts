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
import { CryptoHashService, CryptoEncryptService, JwtTokenService } from '@/infra/services'
import { UserRepository } from '@/infra/repositories/user-repository'
import { UserDao } from '@/infra/dao/user-dao'
import { Postgres } from '@/infra/db'

export const makeSignUpController = (): WebController => {
  const postgresDb = Postgres

  const userDao = new UserDao(postgresDb.connect())
  const userRepository = new UserRepository(userDao)

  const cryptoEncryptService = new CryptoEncryptService()
  const cryptoHashService = new CryptoHashService()
  const jwtTokenService = new JwtTokenService()

  const signUpUseCase = new SignUpUseCase(userRepository, cryptoHashService, cryptoEncryptService, jwtTokenService)

  const signUpController = new SignUpController(signUpUseCase)
  const controller = new WebController(signUpController)

  return controller
}

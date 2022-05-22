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
import { UserDao, RefreshTokenDao } from '@/infra/dao'
import { Postgres } from '@/infra/db'

export const makeSignUpController = (): WebController => {
  const postgresDb = Postgres.connect()

  const userDao = new UserDao(postgresDb)
  const refreshTokenDAO = new RefreshTokenDao(postgresDb)

  const userRepository = new UserRepository(userDao, refreshTokenDAO)

  const cryptoEncryptService = new CryptoEncryptService()
  const cryptoHashService = new CryptoHashService()
  const jwtTokenService = new JwtTokenService()

  const signUpUseCase = new SignUpUseCase(userRepository, cryptoHashService, cryptoEncryptService, jwtTokenService)

  const signUpController = new SignUpController(signUpUseCase)

  return signUpController
}

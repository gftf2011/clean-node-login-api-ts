/**
 * Use Cases
 */
import { SignUpUseCase } from '@/use-cases/sign-up-use-case'

/**
 * Presentation
 */
import { Controller } from '@/presentation/ports'
import { SignUpController } from '@/presentation/controllers'

/**
 * Infrastructure
 */
import { CryptoHashService, CryptoEncryptService, JwtTokenService } from '@/infra/services'
import { UserRepository } from '@/infra/repositories/user-repository'
import { UserDao, RefreshTokenDao } from '@/infra/dao'
import { PostgresDbClientManager, PostgresDbClientPool } from '@/infra/db'
import { DbTransactionDecorator } from '@/infra/db/helpers/decorators/db-transaction-decorator'

export const makeSignUpController = (): Controller => {
  const postgresPool = PostgresDbClientPool.getInstance()

  const postgresClientManager = new PostgresDbClientManager(postgresPool)

  const userDao = new UserDao(postgresClientManager)
  const refreshTokenDAO = new RefreshTokenDao(postgresClientManager)

  const userRepository = new UserRepository(userDao, refreshTokenDAO)

  const cryptoEncryptService = new CryptoEncryptService()
  const cryptoHashService = new CryptoHashService()
  const jwtTokenService = new JwtTokenService()

  const signUpUseCase = new SignUpUseCase(userRepository, cryptoHashService, cryptoEncryptService, jwtTokenService)

  const signUpController = new SignUpController(signUpUseCase)

  const decorator = new DbTransactionDecorator(signUpController, postgresClientManager)

  return decorator
}

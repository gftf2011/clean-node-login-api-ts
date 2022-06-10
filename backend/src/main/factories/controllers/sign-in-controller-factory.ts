/**
 * Use Cases
 */
import { SignInUseCase } from '@/use-cases'

/**
  * Presentation
  */
import { Controller } from '@/presentation/ports'
import { SignInController } from '@/presentation/controllers'

/**
  * Infrastructure
  */
import { CryptoHashService, CryptoEncryptService, JwtTokenService } from '@/infra/services'
import { UserRepository } from '@/infra/repositories'
import { UserDao, RefreshTokenDao, AccessTokenDao } from '@/infra/dao'
import { PostgresDbClientManager, PostgresDbClientPool } from '@/infra/db'
import { DbTransactionDecorator } from '@/infra/db/helpers/decorators/db-transaction-decorator'

export const makeSignInController = (): Controller => {
  const postgresPool = PostgresDbClientPool.getInstance()

  const postgresClientManager = new PostgresDbClientManager(postgresPool)

  const userDao = new UserDao(postgresClientManager)
  const refreshTokenDao = new RefreshTokenDao(postgresClientManager)
  const accessTokenDao = new AccessTokenDao(postgresClientManager)

  const userRepository = new UserRepository(userDao, refreshTokenDao, accessTokenDao)

  const cryptoEncryptService = new CryptoEncryptService()
  const cryptoHashService = new CryptoHashService()
  const jwtTokenService = new JwtTokenService()

  const signInUseCase = new SignInUseCase(userRepository, cryptoEncryptService, cryptoHashService, jwtTokenService)

  const signInController = new SignInController(signInUseCase)

  const decorator = new DbTransactionDecorator(signInController, postgresClientManager)

  return decorator
}

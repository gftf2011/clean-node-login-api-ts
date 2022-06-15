/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../use-cases'

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'
import { SignUpController } from '../../../presentation/controllers'

/**
 * Infrastructure
 */
import { CryptoHashService, CryptoEncryptService, JwtTokenService } from '../../../infra/services'
import { UserRepository } from '../../../infra/repositories'
import { UserDao } from '../../../infra/dao'
import { PostgresDbClientManager, PostgresDbClientPool } from '../../../infra/db'
import { DbTransactionDecorator } from '../../../infra/db/helpers/decorators/db-transaction-decorator'
import { RabbitmqQueueConnection, RabbitmqQueuePublishManager } from '../../../infra/queue'

export const makeSignUpController = (): Controller => {
  const queue = RabbitmqQueueConnection.getInstance()

  const queueManager = new RabbitmqQueuePublishManager(queue)

  const postgresPool = PostgresDbClientPool.getInstance()

  const postgresClientManager = new PostgresDbClientManager(postgresPool)

  const userDao = new UserDao(postgresClientManager)

  const userRepository = new UserRepository(userDao)

  const cryptoEncryptService = new CryptoEncryptService()
  const cryptoHashService = new CryptoHashService()
  const jwtTokenService = new JwtTokenService()

  const signUpUseCase = new SignUpUseCase(userRepository, cryptoHashService, cryptoEncryptService, jwtTokenService, queueManager)

  const signUpController = new SignUpController(signUpUseCase)

  const decorator = new DbTransactionDecorator(signUpController, postgresClientManager)

  return decorator
}

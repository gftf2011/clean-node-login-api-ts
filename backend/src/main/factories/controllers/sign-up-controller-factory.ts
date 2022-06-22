/**
 * Infra
 */
import {
  CryptoEncryptService,
  CryptoHashService,
  JwtTokenService,
} from '../../../infra/services'
import {
  PostgresDbClientManager,
  PostgresDbClientPool,
} from '../../../infra/db'
import {
  RabbitmqQueueConnection,
  RabbitmqQueuePublishManager,
} from '../../../infra/queue'

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'

/**
 * Infra
 */
import { DbTransactionDecorator } from '../../../infra/db/helpers/decorators/db-transaction-decorator'

/**
 * Presentation
 */
import { SignUpController } from '../../../presentation/controllers'

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../use-cases'

/**
 * Infra
 */
import { UserDao } from '../../../infra/dao'
import { UserRepository } from '../../../infra/repositories'

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

  const signUpUseCase = new SignUpUseCase(
    userRepository,
    cryptoHashService,
    cryptoEncryptService,
    jwtTokenService,
    queueManager
  )

  const signUpController = new SignUpController(signUpUseCase)

  const decorator = new DbTransactionDecorator(
    signUpController,
    postgresClientManager
  )

  return decorator
}

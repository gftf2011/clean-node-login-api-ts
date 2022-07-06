/**
 * Infra
 */
import { DbClientPool, DbTransactionSession } from '../../../infra/contracts'
import {
  GoogleOAuth2Service,
  NodemailerEmailService,
} from '../../../infra/services'

/**
 * Infra
 */
import { MongoDbClientManager, MongoDbClientPool } from '../../../infra/db'

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports'

/**
 * Infra
 */
import { DbTransactionDecorator } from '../../../infra/db/helpers/decorators/db-transaction-decorator'
import { UserDao } from '../../../infra/dao'
import { UserRepository } from '../../../infra/repositories'

/**
 * Presentation
 */
import { WelcomeEmailController } from '../../../presentation/controllers'
import { WelcomeEmailTemplate } from '../../../presentation/views'

/**
 * Use Cases
 */
import { WelcomeEmailUseCase } from '../../../use-cases'

export const makeSendWelcomeEmailController = (): Controller => {
  const mongoDbClientPoolAndTransaction = MongoDbClientPool.getInstance()
  const mongoDbClientPool: DbClientPool = mongoDbClientPoolAndTransaction
  const mongoDbTransactionSession: DbTransactionSession =
    mongoDbClientPoolAndTransaction
  const mongoDbClientManager = new MongoDbClientManager(
    mongoDbClientPool,
    mongoDbTransactionSession
  )
  const userDao = new UserDao(mongoDbClientManager)
  const userRepository = new UserRepository(userDao)

  const welcomeEmailTemplate = new WelcomeEmailTemplate()

  const nodemailerEmailService = new NodemailerEmailService()

  const googleOAuth2Service = new GoogleOAuth2Service()

  const welcomeEmailUseCase = new WelcomeEmailUseCase(
    nodemailerEmailService,
    welcomeEmailTemplate,
    googleOAuth2Service,
    userRepository
  )

  const welcomeEmailController = new WelcomeEmailController(welcomeEmailUseCase)

  const decorator = new DbTransactionDecorator(
    welcomeEmailController,
    mongoDbClientManager
  )

  return decorator
}

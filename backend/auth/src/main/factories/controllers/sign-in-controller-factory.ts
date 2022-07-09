/**
 * Infra
 */
import {
  CryptoEncryptService,
  CryptoHashService,
  JwtTokenService,
} from '../../../infra/services';
import {
  PostgresDbClientManager,
  PostgresDbClientPool,
} from '../../../infra/db';
import {
  RabbitmqQueueConnection,
  RabbitmqQueuePublishManager,
} from '../../../infra/queue';

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports';

/**
 * Infra
 */
import { DbTransactionDecorator } from '../../../infra/db/helpers/decorators/db-transaction-decorator';

/**
 * Presentation
 */
import { SignInController } from '../../../presentation/controllers';

/**
 * Use Cases
 */
import { SignInUseCase } from '../../../use-cases';

/**
 * Infra
 */
import { UserDao } from '../../../infra/dao';
import { UserRepository } from '../../../infra/repositories';

export const makeSignInController = (): Controller => {
  const queue = RabbitmqQueueConnection.getInstance();

  const queueManager = new RabbitmqQueuePublishManager(queue);

  const postgresPool = PostgresDbClientPool.getInstance();

  const postgresClientManager = new PostgresDbClientManager(postgresPool);

  const userDao = new UserDao(postgresClientManager);

  const userRepository = new UserRepository(userDao);

  const cryptoEncryptService = new CryptoEncryptService();
  const cryptoHashService = new CryptoHashService();
  const jwtTokenService = new JwtTokenService();

  const signInUseCase = new SignInUseCase(
    userRepository,
    cryptoEncryptService,
    cryptoHashService,
    jwtTokenService,
    queueManager,
  );

  const signInController = new SignInController(signInUseCase);

  const decorator = new DbTransactionDecorator(
    signInController,
    postgresClientManager,
  );

  return decorator;
};

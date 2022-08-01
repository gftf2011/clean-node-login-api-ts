/**
 * Infra
 */
import {
  CreateUserDao,
  FindUserByEmailDao,
  ListBlacklistTaxvatDao,
} from '../../../infra/dao';
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
import { CircuitBreakerDaoProxy } from '../../../infra/dao/helpers/proxies/circuit-breaker-dao-proxy';

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
import { SignUpController } from '../../../presentation/controllers';

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../use-cases';

/**
 * Infra
 */
import { TaxvatBlacklistValidatorAdapter } from '../../../infra/validators';
import { UserRepository } from '../../../infra/repositories';

export const makeSignUpController = (): Controller => {
  const queue = RabbitmqQueueConnection.getInstance();

  const queueManager = new RabbitmqQueuePublishManager(queue);

  const postgresPool = PostgresDbClientPool.getInstance();

  const postgresClientManager = new PostgresDbClientManager(postgresPool);

  const createUserDao = new CreateUserDao(postgresClientManager);
  const findUserByEmailDao = new FindUserByEmailDao(postgresClientManager);
  const listBlacklistTaxvatDao = new ListBlacklistTaxvatDao(
    postgresClientManager,
  );

  const createUserDaoCircuitBreakerProxy = new CircuitBreakerDaoProxy(
    createUserDao,
  );
  const findUserByEmailDaoCircuitBreakerProxy = new CircuitBreakerDaoProxy(
    findUserByEmailDao,
  );
  const listBlacklistTaxvatDaoCircuitBreakerProxy = new CircuitBreakerDaoProxy(
    listBlacklistTaxvatDao,
  );

  const userRepository = new UserRepository(
    createUserDaoCircuitBreakerProxy,
    findUserByEmailDaoCircuitBreakerProxy,
  );

  const cryptoEncryptService = new CryptoEncryptService();
  const cryptoHashService = new CryptoHashService();
  const jwtTokenService = new JwtTokenService();

  const signUpUseCase = new SignUpUseCase(
    userRepository,
    cryptoHashService,
    cryptoEncryptService,
    jwtTokenService,
    queueManager,
  );

  const taxvatBlacklistValidatorAdapter = new TaxvatBlacklistValidatorAdapter(
    listBlacklistTaxvatDaoCircuitBreakerProxy,
  );

  const signUpController = new SignUpController(signUpUseCase, [
    taxvatBlacklistValidatorAdapter,
  ]);

  const decorator = new DbTransactionDecorator(
    signUpController,
    postgresClientManager,
  );

  return decorator;
};

/**
 * Infra
 */
import { CreateUserDao, FindUserByEmailDao } from '../../../infra/dao';
import {
  CryptoEncryptService,
  CryptoHashService,
  JwtTokenService,
} from '../../../infra/services';
import {
  PostgresDbClientManager,
  PostgresDbClientPool,
} from '../../../infra/db';
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
import { SignInController } from '../../../presentation/controllers';

/**
 * Use Cases
 */
import { SignInUseCase } from '../../../use-cases';

/**
 * Infra
 */
import { UserRepository } from '../../../infra/repositories';

export const makeSignInController = (): Controller => {
  const postgresPool = PostgresDbClientPool.getInstance();

  const postgresClientManager = new PostgresDbClientManager(postgresPool);

  const createUserDao = new CreateUserDao(postgresClientManager);
  const findUserByEmailDao = new FindUserByEmailDao(postgresClientManager);

  const createUserDaoCircuitBreakerProxy = new CircuitBreakerDaoProxy(
    createUserDao,
  );
  const findUserByEmailDaoCircuitBreakerProxy = new CircuitBreakerDaoProxy(
    findUserByEmailDao,
  );

  const userRepository = new UserRepository(
    createUserDaoCircuitBreakerProxy,
    findUserByEmailDaoCircuitBreakerProxy,
  );

  const cryptoEncryptService = new CryptoEncryptService();
  const cryptoHashService = new CryptoHashService();
  const jwtTokenService = new JwtTokenService();

  const signInUseCase = new SignInUseCase(
    userRepository,
    cryptoEncryptService,
    cryptoHashService,
    jwtTokenService,
  );

  const signInController = new SignInController(signInUseCase, []);

  const decorator = new DbTransactionDecorator(
    signInController,
    postgresClientManager,
  );

  return decorator;
};

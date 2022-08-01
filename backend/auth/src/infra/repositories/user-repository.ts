/**
 * Infra
 */
import { ICreateUserDao, IFindUserByEmailDao } from '../contracts';

/**
 * Use Cases
 */
import { IUserRepository, UserDto as User } from '../../use-cases/ports';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Provides an abstraction, contract interface, of data gathering
 * It uses the {@link https://deviq.com/design-patterns/repository-pattern Repository} design pattern
 * @obs Here the approaching method used was the repository guided by business logic
 */
export class UserRepository implements IUserRepository {
  constructor(
    private readonly createUserDao: ICreateUserDao,
    private readonly findUserByEmailDao: IFindUserByEmailDao,
  ) {}

  async create(user: User): Promise<User> {
    const userResponse = await this.createUserDao.execute(user);
    return userResponse;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.findUserByEmailDao.execute(email);
  }
}

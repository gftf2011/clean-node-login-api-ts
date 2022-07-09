/**
 * Use Cases
 */
import { IUserRepository, UserDto as User } from '../../use-cases/ports';

/**
 * Infra
 */
import { IUserDao } from '../contracts';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Provides an abstraction, contract interface, of data gathering
 * It uses the {@link https://deviq.com/design-patterns/repository-pattern Repository} design pattern
 * @obs Here the approaching method used was the repository guided by business logic
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly userDAO: IUserDao) {
    this.userDAO = userDAO;
  }

  async create(user: User): Promise<User> {
    const userResponse = await this.userDAO.create(user);
    return userResponse;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userDAO.findUserByEmail(email);
  }
}

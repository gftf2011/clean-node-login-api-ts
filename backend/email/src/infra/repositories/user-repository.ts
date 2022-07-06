/**
 * Use Cases
 */
import { IUserRepository, UserDto } from '../../use-cases/ports'

/**
 * Infra
 */
import { IUserDao } from '../contracts'

export class UserRepository implements IUserRepository {
  constructor(private readonly userDAO: IUserDao) {}

  public async create(user: UserDto): Promise<UserDto> {
    return this.userDAO.create(user)
  }

  public async findUserByEmail(email: string): Promise<UserDto> {
    return this.userDAO.findUserByEmail(email)
  }
}

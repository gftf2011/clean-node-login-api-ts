/**
 * Infra
 */
import {
  BasicUserDto,
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class FakeInMemoryUserRepository implements IUserRepository {
  private database: UserDto[] = [];

  constructor() {}

  async create(user: UserDto): Promise<UserDto> {
    this.database.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const result = await this.database.find(user => user.email === email);
    return result;
  }
}

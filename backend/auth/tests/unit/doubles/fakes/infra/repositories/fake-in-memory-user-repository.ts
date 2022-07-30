/**
 * Infra
 */
import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class FakeInMemoryUserRepository implements IUserRepository {
  private database: UserDto[] = [];

  constructor() {}

  async create(user: UserDto): Promise<UserDto> {
    const userCreated = {
      id: `${this.database.length}`,
      ...user,
    };
    this.database.push({ ...userCreated });
    return userCreated;
  }

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const result = await this.database.find(user => user.email === email);
    return result;
  }
}

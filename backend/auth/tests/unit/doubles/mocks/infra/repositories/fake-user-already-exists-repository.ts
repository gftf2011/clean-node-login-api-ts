/**
 * Infra
 */
import {
  BasicUserDto,
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class FakeUserAlreadyExistsRepository implements IUserRepository {
  private database: UserDto[] = [];

  constructor(private readonly user: BasicUserDto) {
    const newUser = {
      ...user,
      confirmed: false,
      id: `${this.database.length}`,
    };
    this.database.push(newUser);
  }

  create: (user: UserDto) => Promise<UserDto>;

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const result = await this.database.find(user => user.email === email);
    return result;
  }
}

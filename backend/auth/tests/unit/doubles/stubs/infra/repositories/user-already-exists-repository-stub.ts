import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class UserAlreadyExistsRepositoryStub implements IUserRepository {
  create: (user: UserDto) => Promise<UserDto>;

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    return Promise.resolve({
      id: '0',
      email,
      confirmed: false,
      lastname: 'lastname',
      name: 'name',
      password: 'password',
      taxvat: '11111111111',
    });
  }
}

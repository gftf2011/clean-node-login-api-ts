import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class UserAlreadyExistsRepositoryStub implements IUserRepository {
  create: (user: UserDto) => Promise<UserDto>;

  async findUserByEmail(_email: string): Promise<UserDto | undefined> {
    return {} as any;
  }
}

import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class UserRepositorySpy implements IUserRepository {
  create: (user: UserDto) => Promise<UserDto>;

  findUserByEmail: (email: string) => Promise<UserDto | undefined>;
}

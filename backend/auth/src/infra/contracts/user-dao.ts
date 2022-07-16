/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports';

export interface IUserDao {
  create: (user: User) => Promise<User>;
  findUserByEmail: (email: string) => Promise<User | undefined>;
}

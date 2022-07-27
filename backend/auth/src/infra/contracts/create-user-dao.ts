/**
 * Infra
 */
import { Dao } from './dao';

/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports';

export interface ICreateUserDao extends Dao<User> {
  execute: (user: User) => Promise<User>;
}

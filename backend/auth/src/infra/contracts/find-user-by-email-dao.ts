/**
 * Infra
 */
import { Dao } from './dao';

/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports';

export interface IFindUserByEmailDao extends Dao<User> {
  execute: (email: string) => Promise<User>;
}

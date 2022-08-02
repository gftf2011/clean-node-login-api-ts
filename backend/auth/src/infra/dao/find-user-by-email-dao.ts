/**
 * Infra
 */
import { DbClientManager, IFindUserByEmailDao } from '../contracts';

/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Data persistence abstraction, lower to data storage system
 * It uses the {@link https://www.tutorialspoint.com/design_pattern/data_access_object_pattern.htm Data Access Object} Design Pattern
 */
export class FindUserByEmailDao implements IFindUserByEmailDao {
  constructor(private readonly dbClientManager: DbClientManager) {}

  async execute(email: string): Promise<User> {
    const statement = 'SELECT * FROM users_schema.users WHERE email LIKE $1';

    const values: any[] = [email];

    const response = await this.dbClientManager.query(statement, values);
    const parsedResponse: User = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
          taxvat: response.rows[0].taxvat,
          confirmed: response.rows[0].confirmed,
        }
      : undefined;
    return parsedResponse;
  }
}

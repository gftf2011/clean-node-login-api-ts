/**
 * Infra
 */
import { DbClientManager, ICreateUserDao } from '../contracts';

/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports';

export class CreateUserDao implements ICreateUserDao {
  constructor(private readonly dbClientManager: DbClientManager) {}

  async execute(user: User): Promise<User> {
    const statement =
      'INSERT INTO users_schema.users(name, lastname, taxvat, email, password, confirmed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

    const values: any[] = [
      user.name,
      user.lastname,
      user.taxvat,
      user.email,
      user.password,
      user.confirmed,
    ];

    const response = await this.dbClientManager.query(statement, values);

    const parsedResponse: User = {
      id: response.rows[0].id,
      email: response.rows[0].email,
      lastname: response.rows[0].lastname,
      name: response.rows[0].name,
      password: response.rows[0].password,
      taxvat: response.rows[0].taxvat,
      confirmed: response.rows[0].confirmed,
    };
    return parsedResponse;
  }
}

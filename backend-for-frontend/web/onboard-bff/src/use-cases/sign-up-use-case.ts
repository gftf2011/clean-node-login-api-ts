/**
 * Use Cases
 */
import {
  AuthenticatedAccountDto,
  BasicUserDto,
  IHttpAuthService,
  ISignUpUseCase,
  UserDto,
} from './ports';

/**
 * Shared
 */
import { Either, left, right } from '../shared';

/**
 * Entites
 */
import { UserEntity } from '../entities';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to perform a sign-up operation
 */
export class SignUpUseCase implements ISignUpUseCase {
  constructor(private readonly httpAuthService: IHttpAuthService) {}

  /**
   * @desc performs the sign-up action
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {BasicUserDto} request - request that contains an user information
   * @param {string} host - the application host
   * @returns {Promise<Either<Error, AuthenticatedAccountDto>>} data output after sign-up
   */
  async perform(
    request: BasicUserDto,
    host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    const { email, password, lastname, name, taxvat } = request;

    const userOrError: UserEntity = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );

    const user: UserDto = {
      email: userOrError.getEmail(),
      name: userOrError.getName(),
      lastname: userOrError.getLastname(),
      taxvat: userOrError.getTaxvat(),
      password: userOrError.getPassword(),
    };

    const authenticatedAccountOrError = await this.httpAuthService.signUp(
      user,
      host,
    );

    if (authenticatedAccountOrError.isLeft()) {
      return left(authenticatedAccountOrError.value);
    }

    return right(authenticatedAccountOrError.value);
  }
}

/**
 * Use Cases
 */
import {
  AccountDto,
  AuthenticatedAccountDto,
  IHttpAuthService,
  ISignInUseCase,
} from './ports'

/**
 * Shared
 */
import { Either, left, right } from '../shared'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to perform a sign-in operation
 */
export class SignInUseCase implements ISignInUseCase {
  constructor(private readonly httpAuthService: IHttpAuthService) {}

  /**
   * @desc performs the sign-in action
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {AccountDto} request - request that contains an user account information
   * @param {string} host - the application host
   * @returns {Promise<Either<Error, AuthenticatedAccountDto>>} data output after sign-up
   */
  async perform(
    request: AccountDto,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    const authenticatedAccountOrError = await this.httpAuthService.signIn(
      request,
      host
    )

    if (authenticatedAccountOrError.isLeft()) {
      return left(authenticatedAccountOrError.value)
    }

    return right(authenticatedAccountOrError.value)
  }
}

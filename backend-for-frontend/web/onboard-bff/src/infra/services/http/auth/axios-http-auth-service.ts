/**
 * Use Cases
 */
import {
  AccountDto as Account,
  AuthenticatedAccountDto,
  IHttpAuthService,
  BasicUserDto as User,
} from '../../../../use-cases/ports'

/**
 * Shared
 */
import { Either, left, right } from '../../../../shared'

/**
 * Driver
 */
import axios from 'axios'

export class AxiosHttpAuthService implements IHttpAuthService {
  async signUp(
    user: User,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        'http://0.0.0.0:3333/api/sign-up',
        user,
        {
          headers: {
            host,
          },
        }
      )

      return right(response.data)
    } catch (error) {
      /**
       * TODO: create an error interceptor to return error properly
       */
      return left(error as Error)
    }
  }

  async signIn(
    account: Account,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        'http://0.0.0.0:3333/api/sign-in',
        account,
        {
          headers: {
            host,
          },
        }
      )

      return right(response.data)
    } catch (error) {
      /**
       * TODO: create an error interceptor to return error properly
       */
      return left(error as Error)
    }
  }
}

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
import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidTaxvatError,
  ServerError,
  UnauthorizedError,
  UserAlreadyExistsError,
} from '../../../../shared/errors'

/**
 * Driver
 */
import axios, { AxiosError } from 'axios'

export class AxiosHttpAuthService implements IHttpAuthService {
  public constructor() {
    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ name: string }>) => {
        if (
          error.response.status === 401 &&
          error.response.data.name === 'UnauthorizedError'
        ) {
          return new UnauthorizedError()
        } else if (
          error.response.status === 403 &&
          error.response.data.name === 'UserAlreadyExistsError'
        ) {
          return new UserAlreadyExistsError()
        } else if (
          error.response.status === 400 &&
          error.response.data.name === 'InvalidNameError'
        ) {
          return new InvalidNameError(JSON.parse(error.config.data).name)
        } else if (
          error.response.status === 400 &&
          error.response.data.name === 'InvalidLastameError'
        ) {
          return new InvalidLastnameError(
            JSON.parse(error.config.data).lastname
          )
        } else if (
          error.response.status === 400 &&
          error.response.data.name === 'InvalidTaxvatError'
        ) {
          return new InvalidTaxvatError(JSON.parse(error.config.data).taxvat)
        } else if (
          error.response.status === 400 &&
          error.response.data.name === 'InvalidEmailError'
        ) {
          return new InvalidEmailError(JSON.parse(error.config.data).email)
        } else if (
          error.response.status === 400 &&
          error.response.data.name === 'InvalidPasswordError'
        ) {
          return new InvalidPasswordError(
            JSON.parse(error.config.data).password
          )
        }
        return new ServerError()
      }
    )
  }

  async signUp(
    user: User,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.AUTH_BACKEND_SERVICE_URL) {
      return left(new ServerError())
    }
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        `${process.env.AUTH_BACKEND_SERVICE_URL}/sign-up`,
        user,
        {
          headers: {
            host,
          },
        }
      )

      return right(response.data)
    } catch (error) {
      return left(error as Error)
    }
  }

  async signIn(
    account: Account,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.AUTH_BACKEND_SERVICE_URL) {
      return left(new ServerError())
    }
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        `${process.env.AUTH_BACKEND_SERVICE_URL}/sign-in`,
        account,
        {
          headers: {
            host,
          },
        }
      )

      return right(response.data)
    } catch (error) {
      return left(error as Error)
    }
  }
}

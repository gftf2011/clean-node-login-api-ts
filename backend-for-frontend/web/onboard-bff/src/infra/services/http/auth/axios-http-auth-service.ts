/**
 * Use Cases
 */
import axios, { AxiosError } from 'axios';
// eslint-disable-next-line sort-imports
import {
  AccountDto as Account,
  AuthenticatedAccountDto,
  IHttpAuthService,
  BasicUserDto as User,
} from '../../../../use-cases/ports';

/**
 * Shared
 */
import { Either, left, right } from '../../../../shared';
import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidTaxvatError,
  ServerError,
  UnauthorizedError,
  UserAlreadyExistsError,
} from '../../../../shared/errors';

/**
 * Driver
 */

export class AxiosHttpAuthService implements IHttpAuthService {
  private handleAxiosError(error: AxiosError<{ name: string }>): Error {
    if (
      error.response.status === 401 &&
      error.response.data.name === 'UnauthorizedError'
    ) {
      return new UnauthorizedError();
    }
    if (
      error.response.status === 403 &&
      error.response.data.name === 'UserAlreadyExistsError'
    ) {
      return new UserAlreadyExistsError();
    }
    if (
      error.response.status === 400 &&
      error.response.data.name === 'InvalidNameError'
    ) {
      return new InvalidNameError(JSON.parse(error.config.data).name);
    }
    if (
      error.response.status === 400 &&
      error.response.data.name === 'InvalidLastameError'
    ) {
      return new InvalidLastnameError(JSON.parse(error.config.data).lastname);
    }
    if (
      error.response.status === 400 &&
      error.response.data.name === 'InvalidTaxvatError'
    ) {
      return new InvalidTaxvatError(JSON.parse(error.config.data).taxvat);
    }
    if (
      error.response.status === 400 &&
      error.response.data.name === 'InvalidEmailError'
    ) {
      return new InvalidEmailError(JSON.parse(error.config.data).email);
    }
    if (
      error.response.status === 400 &&
      error.response.data.name === 'InvalidPasswordError'
    ) {
      return new InvalidPasswordError(JSON.parse(error.config.data).password);
    }
    return new ServerError();
  }

  async signUp(
    user: User,
    host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.AUTH_BACKEND_SERVICE_URL) {
      return left(new ServerError());
    }
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        `${process.env.AUTH_BACKEND_SERVICE_URL}/sign-up`,
        user,
        {
          headers: {
            host,
          },
          validateStatus: status => {
            return status < 300; // Resolve only if the status code is less than 300
          },
        },
      );

      return right(response.data);
    } catch (error) {
      return left(this.handleAxiosError(error as AxiosError<{ name: string }>));
    }
  }

  async signIn(
    account: Account,
    host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.AUTH_BACKEND_SERVICE_URL) {
      return left(new ServerError());
    }
    try {
      const response = await axios.post<AuthenticatedAccountDto>(
        `${process.env.AUTH_BACKEND_SERVICE_URL}/sign-in`,
        account,
        {
          headers: {
            host,
          },
          validateStatus: status => {
            return status < 300; // Resolve only if the status code is less than 300
          },
        },
      );

      return right(response.data);
    } catch (error) {
      return left(this.handleAxiosError(error as AxiosError<{ name: string }>));
    }
  }
}

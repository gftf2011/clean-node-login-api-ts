/**
 * Use Cases
 */
import {
  AccountDto,
  AuthenticatedAccountDto,
  IEncryptService,
  IHashService,
  ISignInUseCase,
  ITokenService,
  IUserRepository,
} from './ports';

/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  ForbiddenError,
  ServerError,
  UnauthorizedError,
} from '../shared/errors';

/**
 * Entities
 */
import { AccountEntity } from '../entities';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to perform a sign-in operation
 */
export class SignInUseCase implements ISignInUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptService: IEncryptService,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * @desc performs the sign-up action
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {AccountDto} request - request that contains an account information
   * @param {string} host - the application host
   * @returns {Promise<Either<Error, AuthenticatedAccountDto>>} data output after sign-in
   */
  async perform(
    request: AccountDto,
    host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (
      !process.env.CODE_SALT ||
      !process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
      !process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
      !process.env.JWT_ACCESS_TOKEN_ID ||
      !process.env.JWT_REFRESH_TOKEN_ID ||
      !process.env.APP_SECRET
    ) {
      return left(new ServerError());
    }

    const { email, password } = request;

    const accountOrError: Either<Error, AccountEntity> = AccountEntity.create(
      email,
      password,
    );

    if (accountOrError.isLeft()) {
      return left(accountOrError.value);
    }

    const accountValidated = accountOrError.value.getValue();

    const userExists = await this.userRepository.findUserByEmail(
      accountValidated.email,
    );

    if (!userExists) {
      return left(new ForbiddenError());
    }

    const decryptedTaxvat = this.encryptService.decode(userExists.taxvat);
    const customSalt = `${userExists.email}${decryptedTaxvat}`;
    const defaultSalt = process.env.CODE_SALT;
    /**
     * encrypt password with user custom salt hash value
     */
    const hashedPassword = this.hashService.encode(
      userExists.password,
      customSalt,
    );
    /**
     * encrypt encrypted password with code default salt hash value
     */
    const strongHashedPassword = this.hashService.encode(
      hashedPassword,
      defaultSalt,
    );

    if (strongHashedPassword !== userExists.password) {
      return left(new UnauthorizedError());
    }

    const accessTokenId = process.env.JWT_ACCESS_TOKEN_ID;
    const refreshTokenId = process.env.JWT_REFRESH_TOKEN_ID;

    const accessTokenExpiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    const refreshTokenExpiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

    const [refreshTokenOrError, accessTokenOrError] = await Promise.all([
      this.tokenService.sign(
        {
          id: userExists.id,
        },
        {
          subject: process.env.APP_SECRET,
          issuer: host,
          jwtId: refreshTokenId,
        },
        refreshTokenExpiresIn,
      ),
      this.tokenService.sign(
        {
          email: this.encryptService.encode(userExists.email),
        },
        {
          subject: userExists.id,
          issuer: host,
          jwtId: accessTokenId,
        },
        accessTokenExpiresIn,
      ),
    ]);

    if (refreshTokenOrError.isLeft()) {
      return left(refreshTokenOrError.value);
    }
    if (accessTokenOrError.isLeft()) {
      return left(accessTokenOrError.value);
    }

    const authenticatedAccount: AuthenticatedAccountDto = {
      accessToken: accessTokenOrError.value,
      refreshToken: refreshTokenOrError.value,
    };

    return right(authenticatedAccount);
  }
}

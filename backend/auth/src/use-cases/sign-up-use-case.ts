/**
 * Use Cases
 */
import {
  AuthenticatedAccountDto,
  BasicUserDto,
  IEncryptService,
  IHashService,
  ISignUpUseCase,
  ITokenService,
  IUserRepository,
  QueuePublishManager,
  UserDto,
} from './ports';

/**
 * Shared
 */
import { Either, left, right } from '../shared';
import { ServerError, UserAlreadyExistsError } from '../shared/errors';

/**
 * Entites
 */
import { UserEntity } from '../entities';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to perform a sign-up operation
 */
export class SignUpUseCase implements ISignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly encryptService: IEncryptService,
    private readonly tokenService: ITokenService,
    private readonly queueManager: QueuePublishManager,
  ) {}

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

    const { email, password, lastname, name, taxvat } = request;

    const userOrError: Either<Error, UserEntity> = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const userValidated = userOrError.value.getValue();

    const userExists = await this.userRepository.findUserByEmail(
      userValidated.email,
    );

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    const customSalt = `${userValidated.email}${userValidated.taxvat}`;
    const defaultSalt = process.env.CODE_SALT;
    /**
     * encrypt password with user custom salt hash value
     */
    const hashedPassword = this.hashService.encode(
      userValidated.password,
      customSalt,
    );
    /**
     * encrypt encrypted password with code default salt hash value
     */
    const strongHashedPassword = this.hashService.encode(
      hashedPassword,
      defaultSalt,
    );

    const user: UserDto = {
      email: userValidated.email,
      name: userValidated.name,
      lastname: userValidated.lastname,
      taxvat: this.encryptService.encode(userValidated.taxvat),
      password: strongHashedPassword,
      confirmed: false,
    };

    const accessTokenId = process.env.JWT_ACCESS_TOKEN_ID;
    const refreshTokenId = process.env.JWT_REFRESH_TOKEN_ID;

    const accessTokenExpiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    const refreshTokenExpiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

    const userCreated = await this.userRepository.create(user);

    const [refreshTokenOrError, accessTokenOrError] = await Promise.all([
      this.tokenService.sign(
        {
          id: userCreated.id,
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
          email: this.encryptService.encode(userCreated.email),
        },
        {
          subject: userCreated.id,
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

    await this.queueManager.publish(
      'sign-up',
      'welcome-email',
      JSON.stringify(userCreated),
    );

    const authenticatedAccount: AuthenticatedAccountDto = {
      accessToken: accessTokenOrError.value,
      refreshToken: refreshTokenOrError.value,
    };

    return right(authenticatedAccount);
  }
}

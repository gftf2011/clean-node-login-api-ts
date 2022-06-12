/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { ServerError, UnauthorizedError } from '@/shared/errors'

/**
 * Entites
 */
import { RefreshTokenEntity } from '@/entities'

/**
 * Use Cases
 */
import { AccountDto, AuthenticatedAccountDto, IEncryptService, IHashService, ISignInUseCase, ITokenService, IUserRepository, RefreshTokenDto } from '@/use-cases/ports'

/**
  * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
  * @desc Contains the logic to perform a sign-in operation
  */
export class SignInUseCase implements ISignInUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly encryptService: IEncryptService,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  /**
   * @desc performs the sign-up action
   * @param {AccountDto} request - request that contains an account information
   * @param {string} host - the application host
   * @returns {Promise<Either<Error, AuthenticatedAccountDto>>} data output after sign-in
   */
  async perform (request: AccountDto, host: string): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.CODE_SALT && !process.env.REFRESH_TOKEN_DURATION) {
      return left(new ServerError())
    }

    const refreshTokenOrError: Either<Error, RefreshTokenEntity> = RefreshTokenEntity.create(Date.now(), +process.env.REFRESH_TOKEN_DURATION)

    if (refreshTokenOrError.isLeft()) {
      return left(refreshTokenOrError.value)
    }

    const { email, password } = request
    const userExists = await this.userRepository.findUserByEmail(email)

    if (!userExists) {
      return left(new UnauthorizedError())
    }

    const decryptedTaxvat = this.encryptService.decode(userExists.taxvat)
    const customSalt = `${email}${decryptedTaxvat}`
    const defaultSalt = process.env.CODE_SALT
    /**
     * encrypt password with user custom salt hash value
     */
    const hashedPassword = this.hashService.encode(password, customSalt)
    /**
     * encrypt encrypted password with code default salt hash value
     */
    const strongHashedPassword = this.hashService.encode(hashedPassword, defaultSalt)

    if (strongHashedPassword !== userExists.password) {
      return left(new UnauthorizedError())
    }

    const refreshToken: RefreshTokenDto = {
      expiresIn: refreshTokenOrError.value.getExpiresIn()
    }

    const accessTokenOrError = this.tokenService.sign(
      {
        id: this.encryptService.encode(userExists.email)
      },
      {
        subject: email,
        issuer: host
      }
    )

    if (accessTokenOrError.isLeft()) {
      return left(accessTokenOrError.value)
    }

    let updatedUser = await this.userRepository.updateUserRefreshToken(
      userExists.refreshTokenId,
      refreshToken
    )

    updatedUser = await this.userRepository.updateUserAccessToken(
      userExists.accessTokenId,
      accessTokenOrError.value
    )

    const authenticatedAccount: AuthenticatedAccountDto = {
      accessToken: accessTokenOrError.value,
      refreshToken: updatedUser.refreshTokenId
    }

    return right(authenticatedAccount)
  }
}

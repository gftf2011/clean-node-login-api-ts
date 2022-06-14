/**
 * Shared
 */

import { Either, left, right } from '@/shared'
import { ServerError, UnauthorizedError } from '@/shared/errors'

/**
 * Use Cases
 */
import { AccountDto, AuthenticatedAccountDto, IEncryptService, IHashService, ISignInUseCase, ITokenService, IUserRepository, QueuePublishManager } from '@/use-cases/ports'

/**
  * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
  * @desc Contains the logic to perform a sign-in operation
  */
export class SignInUseCase implements ISignInUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly encryptService: IEncryptService,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
    private readonly queueManager: QueuePublishManager
  ) {}

  /**
   * @desc performs the sign-up action
   * @param {AccountDto} request - request that contains an account information
   * @param {string} host - the application host
   * @returns {Promise<Either<Error, AuthenticatedAccountDto>>} data output after sign-in
   */
  async perform (request: AccountDto, host: string): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (
      !process.env.CODE_SALT &&
      !process.env.JWT_ACCESS_TOKEN_EXPIRES_IN &&
      !process.env.JWT_REFRESH_TOKEN_EXPIRES_IN &&
      !process.env.JWT_ACCESS_TOKEN_ID &&
      !process.env.JWT_REFRESH_TOKEN_ID &&
      !process.env.APP_SECRET
    ) {
      return left(new ServerError())
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

    const accessTokenId = process.env.JWT_ACCESS_TOKEN_ID
    const refreshTokenId = process.env.JWT_REFRESH_TOKEN_ID

    const accessTokenExpiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    const refreshTokenExpiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

    const refreshTokenOrError = this.tokenService.sign(
      {
        id: userExists.id
      },
      {
        subject: process.env.APP_SECRET,
        issuer: host,
        jwtId: refreshTokenId
      },
      refreshTokenExpiresIn
    )
    const accessTokenOrError = this.tokenService.sign(
      {
        email: this.encryptService.encode(userExists.email)
      },
      {
        subject: userExists.id,
        issuer: host,
        jwtId: accessTokenId
      },
      accessTokenExpiresIn
    )

    if (refreshTokenOrError.isLeft()) {
      return left(refreshTokenOrError.value)
    }
    if (accessTokenOrError.isLeft()) {
      return left(accessTokenOrError.value)
    }

    await this.queueManager.publish('send-email-to-complete-sign-in', JSON.stringify(userExists))

    const authenticatedAccount: AuthenticatedAccountDto = {
      accessToken: accessTokenOrError.value,
      refreshToken: refreshTokenOrError.value
    }

    return right(authenticatedAccount)
  }
}

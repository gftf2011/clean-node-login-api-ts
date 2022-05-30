/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { UserAlreadyExistsError, ServerError } from '@/shared/errors'

/**
 * Entites
 */
import { UserEntity, RefreshTokenEntity } from '@/entities'

/**
 * Use Cases
 */
import {
  IUserRepository,
  UserDto,
  RefreshTokenDto,
  BasicUserDto,
  ISignUpUseCase,
  IHashService,
  IEncryptService,
  ITokenService,
  AuthenticatedAccountDto
} from '@/use-cases/ports'

export class SignUpUseCase implements ISignUpUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly encryptService: IEncryptService,
    private readonly tokenService: ITokenService
  ) {}

  async perform (request: BasicUserDto, host: string): Promise<Either<Error, AuthenticatedAccountDto>> {
    if (!process.env.CODE_SALT && !process.env.REFRESH_TOKEN_DURATION) {
      return left(new ServerError())
    }

    const { email, password, lastname, name, taxvat } = request

    const userOrError: Either<Error, UserEntity> = UserEntity.create(name, lastname, taxvat, email, password)
    const refreshTokenOrError: Either<Error, RefreshTokenEntity> = RefreshTokenEntity.create(Date.now(), +process.env.REFRESH_TOKEN_DURATION)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    if (refreshTokenOrError.isLeft()) {
      return left(refreshTokenOrError.value)
    }

    const userExists = await this.userRepository.findUserByEmail(userOrError.value.getEmail())

    if (userExists) {
      return left(new UserAlreadyExistsError())
    }

    const customSalt = `${userOrError.value.getEmail()}${userOrError.value.getTaxvat()}`
    const defaultSalt = process.env.CODE_SALT
    // encrypt password with user custom salt hash value
    const hashedPassword = this.hashService.encode(password, customSalt)
    // encrypt encrypted password with code default salt hash value
    const strongHashedPassword = this.hashService.encode(hashedPassword, defaultSalt)

    const user: UserDto = {
      email: userOrError.value.getEmail(),
      name: userOrError.value.getName(),
      lastname: userOrError.value.getLastname(),
      taxvat: this.encryptService.encode(userOrError.value.getTaxvat()),
      password: strongHashedPassword
    }
    const refreshToken: RefreshTokenDto = {
      expiresIn: refreshTokenOrError.value.getExpiresIn()
    }

    const { refreshTokenId } = await this.userRepository.create(user, refreshToken)
    const accessTokenOrError = this.tokenService.sign({ id: refreshTokenId }, { subject: email, issuer: host })

    if (accessTokenOrError.isLeft()) {
      return left(accessTokenOrError.value)
    }

    const authenticatedAccount: AuthenticatedAccountDto = {
      accessToken: accessTokenOrError.value,
      refreshToken: refreshTokenId
    }

    return right(authenticatedAccount)
  }
}

/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { UserAlreadyExistsError, ServerError } from '@/shared/errors'

/**
 * Entites
 */
import { UserEntity } from '@/entities'

/**
 * Use Cases
 */
import { IUserRepository, UserDto, BasicUserDto, ISignUpUseCase, ITokenService, IEncryptService } from '@/use-cases/ports'

export class SignUpUseCase implements ISignUpUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly cryptoEncryptService: IEncryptService
  ) {}

  async perform (request: BasicUserDto): Promise<Either<Error, UserDto>> {
    if (!process.env.CODE_SALT) {
      return left(new ServerError())
    }
    const { email, password, lastname, name, taxvat } = request
    const userOrError: Either<Error, UserEntity> = UserEntity.create(name, lastname, taxvat, email, password)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const userExists = await this.userRepository.findUserByEmail(this.cryptoEncryptService.encode(userOrError.value.getEmail()))
    if (userExists) {
      return left(new UserAlreadyExistsError())
    }
    const customSalt = `${userOrError.value.getEmail()}${userOrError.value.getTaxvat()}`
    const defaultSalt = process.env.CODE_SALT
    // encrypt password with user custom salt hash value
    const hashedPassword = this.tokenService.encode(password, customSalt)
    // encrypt encrypted password with code default salt hash value
    const strongHashedPassword = this.tokenService.encode(hashedPassword, defaultSalt)
    const user: UserDto = {
      email: this.cryptoEncryptService.encode(userOrError.value.getEmail()),
      name: this.cryptoEncryptService.encode(userOrError.value.getName()),
      lastname: this.cryptoEncryptService.encode(userOrError.value.getLastname()),
      taxvat: this.cryptoEncryptService.encode(userOrError.value.getTaxvat()),
      password: strongHashedPassword
    }
    return right(await this.userRepository.create(user))
  }
}

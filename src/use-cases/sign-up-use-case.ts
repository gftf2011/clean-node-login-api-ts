/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { UserAlreadyExistsError } from '@/shared/errors'

/**
 * Entites
 */
import { UserEntity } from '@/entities'

/**
 * Use Cases
 */
import { IUserRepository, UserDto, BasicUserDto, ISignUpUseCase, ITokenService, SaltType } from '@/use-cases/ports'

export class SignUpUseCase implements ISignUpUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async perform (request: BasicUserDto): Promise<Either<Error, UserDto>> {
    const { email, password, lastname, name, taxvat } = request
    const userOrError: Either<Error, UserEntity> = UserEntity.create(name, lastname, taxvat, email, password)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const userExists = !!this.userRepository.findUserByEmail(userOrError.value.getEmail())
    if (!userExists) {
      return left(new UserAlreadyExistsError())
    }
    const customSaltOrError = this.tokenService.salt(SaltType.CUSTOM)
    if (customSaltOrError.isLeft()) {
      return left(customSaltOrError.value)
    }
    const defaultSaltOrError = this.tokenService.salt(SaltType.DEFAULT)
    if (defaultSaltOrError.isLeft()) {
      return left(defaultSaltOrError.value)
    }
    // encrypt password with user custom salt hash value
    const hashedPassword = this.tokenService.encode(password, customSaltOrError.value)
    // encrypt encrypted password with code default salt hash value
    const strongHashedPassword = this.tokenService.encode(hashedPassword, defaultSaltOrError.value)
    const user: UserDto = {
      email,
      name,
      lastname,
      taxvat,
      salt: customSaltOrError.value,
      password: strongHashedPassword
    }
    return right(await this.userRepository.create(user))
  }
}

/**
 * Shared
 */
import { Either } from '@/shared/either'

/**
 * Entites
 */
import { UserEntity } from '@/entities'
import { IDomainError } from '@/entities/errors'

/**
 * Use Case
 */
import { IUserRepository, UserDto, SignUpDto, ISignUpUseCase } from '@/use-cases/ports'
import { mapUserEntityToDto } from '@/use-cases/helpers/mappers'

export class SignUpUseCase implements ISignUpUseCase {
  constructor (private readonly userRepository: IUserRepository) {}

  async perform (request: SignUpDto): Promise<UserDto> {
    const { user: { email, password, lastname, name, taxvat }, hash, hashedPassword } = request
    const userOrError: Either<IDomainError, UserEntity> = UserEntity.create(name, lastname, taxvat, email, password)
    if (userOrError.isLeft()) {
      throw userOrError.value
    }
    const userEntity: UserEntity = userOrError.value
    const user: UserDto = mapUserEntityToDto(userEntity, hash, hashedPassword)
    return await this.userRepository.create(user)
  }
}

/**
 * Entities
 */
import { UserEntity } from '@/entities'

/**
 * Use Cases
 */
import { UserDto } from '@/use-cases/ports'

export const mapUserEntityToDto = (userEntity: UserEntity, hash: string, hashedPassword: string): UserDto => {
  const userDto: UserDto = {
    email: userEntity.getEmail(),
    hash,
    lastname: userEntity.getLastname(),
    name: userEntity.getName(),
    password: hashedPassword,
    taxvat: userEntity.getTaxvat()
  }
  return userDto
}

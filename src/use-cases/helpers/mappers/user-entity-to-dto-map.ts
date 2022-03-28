/**
 * Entities
 */
import { UserEntity } from '@/entities'

/**
 * Use Cases
 */
import { UserDto } from '@/use-cases/ports'

export const mapUserEntityToDto = (userEntity: UserEntity): UserDto => {
  const userDto: UserDto = {
    email: userEntity.getEmail(),
    hash: userEntity.getHash(),
    lastname: userEntity.getLastname(),
    name: userEntity.getName(),
    password: userEntity.getPassword(),
    taxvat: userEntity.getTaxvat()
  }
  return userDto
}

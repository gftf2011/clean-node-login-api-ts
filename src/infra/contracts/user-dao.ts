import { UserEntity as User } from '@/entities'

export interface IUserDao {
  create: (user: User) => Promise<void>
}

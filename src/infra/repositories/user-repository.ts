/**
 * Use Cases
 */
import { IUserRepository, UserDto as User, RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao, IRefreshTokenDao } from '@/infra/contracts'

export class UserRepository implements IUserRepository {
  private readonly userDAO: IUserDao
  private readonly refreshTokenDAO: IRefreshTokenDao

  constructor (userDAO: IUserDao, refreshTokenDAO: IRefreshTokenDao) {
    this.userDAO = userDAO
    this.refreshTokenDAO = refreshTokenDAO
  }

  async create (user: User, refreshToken: RefreshToken): Promise<User> {
    const refreshTokenResponse = await this.refreshTokenDAO.create(refreshToken)
    const userResponse = await this.userDAO.create(user, refreshTokenResponse.id)
    return userResponse
  }

  async findUserByEmail (email: string): Promise<User> {
    return await this.userDAO.findUserByEmail(email)
  }

  async updateUserRefreshToken (refreshTokenId: string, expiresIn: number): Promise<void> {
    await this.refreshTokenDAO.updateExpiresIn(refreshTokenId, expiresIn)
  }
}

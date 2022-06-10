/**
 * Use Cases
 */
import { IUserRepository, UserDto as User, RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao, IRefreshTokenDao, IAccessTokenDao } from '@/infra/contracts'

export class UserRepository implements IUserRepository {
  private readonly userDAO: IUserDao
  private readonly refreshTokenDAO: IRefreshTokenDao
  private readonly accessTokenDAO: IAccessTokenDao

  constructor (userDAO: IUserDao, refreshTokenDAO: IRefreshTokenDao, accessTokenDAO: IAccessTokenDao) {
    this.userDAO = userDAO
    this.refreshTokenDAO = refreshTokenDAO
    this.accessTokenDAO = accessTokenDAO
  }

  async create (user: User, refreshToken: RefreshToken, accessToken: string): Promise<User> {
    const refreshTokenResponse = await this.refreshTokenDAO.create(refreshToken)
    const accessTokenResponse = await this.accessTokenDAO.create(accessToken)
    const userResponse = await this.userDAO.create(user, refreshTokenResponse.id, accessTokenResponse.id)
    return userResponse
  }

  async findUserByEmail (email: string): Promise<User> {
    return await this.userDAO.findUserByEmail(email)
  }

  async updateUserRefreshToken (oldRefreshTokenId: string, refreshToken: RefreshToken): Promise<User> {
    /**
     * The order from the functions called below must not be changed
     */
    const createdRefreshTokenResponse = await this.refreshTokenDAO.create(refreshToken)
    const updatedUserResponse = await this.userDAO.updateRefreshTokenId(oldRefreshTokenId, createdRefreshTokenResponse.id)
    await this.refreshTokenDAO.deleteById(oldRefreshTokenId)
    return updatedUserResponse
  }
}

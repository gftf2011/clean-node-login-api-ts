export interface UserDto {
  id?: string
  name: string
  lastname: string
  taxvat: string
  email: string
  password: string
  accessTokenId?: string
  refreshTokenId?: string
}

export type BasicUserDto = Omit<Omit<Omit<UserDto, 'accessTokenId'>, 'refreshTokenId'>, 'id'>

export interface UserDto {
  id?: string
  name: string
  lastname: string
  taxvat: string
  email: string
  password: string
  refreshTokenId?: string
}

export type BasicUserDto = Omit<Omit<UserDto, 'refreshTokenId'>, 'id'>

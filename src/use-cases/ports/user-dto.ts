export interface UserDto {
  id?: string
  name: string
  lastname: string
  taxvat: string
  email: string
  password: string
  hash: string
}

export type BasicUserDto = Omit<Omit<UserDto, 'hash'>, 'id'>

export interface UserDto {
  id?: string
  name: string
  lastname: string
  taxvat: string
  email: string
  password: string
  salt: string
}

export type BasicUserDto = Omit<Omit<UserDto, 'salt'>, 'id'>

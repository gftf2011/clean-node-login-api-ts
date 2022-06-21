export interface UserDto {
  id?: string
  name: string
  lastname: string
  taxvat: string
  email: string
  password: string
  confirmed: boolean
}

export type BasicUserDto = Omit<UserDto, 'id'>

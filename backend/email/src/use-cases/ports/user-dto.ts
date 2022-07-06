export interface UserDto {
  id?: string
  name: string
  lastname: string
  email: string
}

export type BasicUserDto = Omit<UserDto, 'id'>

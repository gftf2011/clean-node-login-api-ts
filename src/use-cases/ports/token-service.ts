export interface ITokenService {
  encode: (password: string, salt: string) => string
  compare: (password: string, salt: string, hashedPassword: string) => boolean
}

/**
 * Shared
 */
import { Either } from '@/shared'

export enum SaltType {
  CUSTOM = 0,
  DEFAULT = 1
}

export interface ITokenService {
  salt: (type: SaltType) => Either<Error, string>
  encode: (password: string, salt: string) => string
  compare: (password: string, salt: string, hashedPassword: string) => boolean
}

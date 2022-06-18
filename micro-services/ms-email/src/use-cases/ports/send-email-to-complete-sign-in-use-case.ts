/**
 * Use Cases
 */
import { UserDto } from '../ports'

export interface ISendEmailToCompleteSignInUseCase {
  perform: (request: UserDto) => Promise<void>
}

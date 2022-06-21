/**
 * Use Cases
 */
import { UserDto } from '.'

export interface IWelcomeEmailUseCase {
  perform: (request: UserDto) => Promise<void>
}

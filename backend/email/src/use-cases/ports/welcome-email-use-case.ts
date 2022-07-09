/**
 * Shared
 */
import { Either } from '../../shared';

/**
 * Use Cases
 */
import { UserDto } from './user-dto';

export interface IWelcomeEmailUseCase {
  perform: (request: UserDto) => Promise<Either<Error, any>>;
}

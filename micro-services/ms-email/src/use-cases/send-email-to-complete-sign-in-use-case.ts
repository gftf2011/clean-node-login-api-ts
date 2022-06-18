/**
 * Use Cases
 */
import { ISendEmailToCompleteSignInUseCase, UserDto } from './ports'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to send an email when user tries to sign-in
 */
export class SendEmailToCompleteSignInUseCase implements ISendEmailToCompleteSignInUseCase {
  async perform (request: UserDto): Promise<void> {
    console.log(request)
  }
}

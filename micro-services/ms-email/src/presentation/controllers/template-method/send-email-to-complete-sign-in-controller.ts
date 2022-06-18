/**
 * Use Cases
 */
import { ISendEmailToCompleteSignInUseCase } from '../../../use-cases/ports'

/**
 * Presentation
 */
import { Request } from '../../ports'
import { WebController } from './web-controller'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm and the concrete implementation from the perform method
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export class SendEmailToCompleteSignInController extends WebController {
  private readonly sendEmailToCompleteSignInUseCase: ISendEmailToCompleteSignInUseCase

  /**
   * @desc values overrides - ['email', 'name', 'lastname']
   */
  public override requiredParams: string[] = ['email', 'name', 'lastname']

  constructor (
    sendEmailToCompleteSignInUseCase: ISendEmailToCompleteSignInUseCase
  ) {
    super()
    this.sendEmailToCompleteSignInUseCase = sendEmailToCompleteSignInUseCase
  }

  /**
   * @desc sends an email to verify user sign-in action
   * @param {Request} request - request that contains information about the 'clinet'
   * @returns {Promise<void>}
   */
  public async perform (request: Request): Promise<void> {
    this.sendEmailToCompleteSignInUseCase.perform(request.content)
  }
}

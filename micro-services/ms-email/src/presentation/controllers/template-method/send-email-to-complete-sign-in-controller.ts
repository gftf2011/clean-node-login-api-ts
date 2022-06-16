/**
 * Presentation
 */
import { Request } from '../../ports'

/**
  * Presentation
  */
import { WebController } from './web-controller'

/**
  * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
  * @desc Contains the base algorithm and the concrete implementation from the perform method
  * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
  */
export class SendEmailToCompleteSignInController extends WebController {
  /**
  * @desc values overrides - ['email', 'password']
  */
  public override requiredParams: string[] = ['email', 'name', 'lastname']

  constructor () {
    super()
  }

  /**
   * @desc sends an email to verify user sign-in action
   * @param {Request} request - request that contains information about the 'clinet'
   * @returns {Promise<void>}
   */
  public async perform (request: Request): Promise<void> {
    console.log(request)
  }
}

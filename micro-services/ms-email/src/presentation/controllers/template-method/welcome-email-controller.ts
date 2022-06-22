/**
 * Use Cases
 */
import { IWelcomeEmailUseCase } from '../../../use-cases/ports'

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
export class WelcomeEmailController extends WebController {
  private readonly welcomeEmailUseCase: IWelcomeEmailUseCase

  /**
   * @desc values overrides - ['email', 'name', 'lastname']
   */
  public override requiredParams: string[] = ['email', 'name', 'lastname']

  constructor(welcomeEmailUseCase: IWelcomeEmailUseCase) {
    super()
    this.welcomeEmailUseCase = welcomeEmailUseCase
  }

  /**
   * @desc sends an email to verify user sign-in action
   * @param {Request} request - request that contains information about the 'clinet'
   * @returns {Promise<boolean>} data output if email message was sent
   */
  public async perform(request: Request): Promise<boolean> {
    await this.welcomeEmailUseCase.perform(request.content)
    return true
  }
}

/**
 * Presentation
 */
import { HttpRequest, HttpResponse } from '../../ports'

/**
 * Use Cases
 */
import { ISignInUseCase } from '../../../use-cases/ports'

/**
 * Presentation
 */
import { WebController } from './web-controller'
import { ok } from '../../helpers/http-helper'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm and the concrete implementation from the perform method
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export class SignInController extends WebController {
  private readonly signInUseCase: ISignInUseCase

  /**
   * @desc values overrides - ['host']
   */
  public override requiredHeaderParams: string[] = ['host']
  /**
   * @desc values overrides - ['email', 'password']
   */
  public override requiredParams: string[] = ['email', 'password']

  constructor (signInUseCase: ISignInUseCase) {
    super()
    this.signInUseCase = signInUseCase
  }

  /**
   * @desc performs an sign-up action
   * @param {HttpRequest} request - request that contains information about the 'clinet'
   * @returns {Promise<HttpResponse>} data output after sign-in operation
   */
  public async perform (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.signInUseCase.perform(request.body, request.headers.host)

    if (response.isLeft()) {
      throw response.value
    }

    return ok(response.value)
  }
}

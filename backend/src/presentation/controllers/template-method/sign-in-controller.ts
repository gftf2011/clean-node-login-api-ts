/**
 * Use Cases
 */
import { ISignInUseCase } from '@/use-cases/ports'

/**
 * Presentation
 */
import { HttpRequest, HttpResponse } from '@/presentation/ports'
import { WebController } from './web-controller'
import { ok } from '@/presentation/helpers/http-helper'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm and the concrete implementation from the perform method
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export class SignInController extends WebController {
  private readonly signInUseCase: ISignInUseCase

  /**
   * @desc values overrides - id.
   * This field is an uuid which represents the sign in operation, inside the application
   */
  public override id: string = '46f76d05-3cc0-4aaa-ab41-4b0697ab028c'

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
    const response = await this.signInUseCase.perform(request.body, request.headers.host, this.id)

    if (response.isLeft()) {
      throw response.value
    }

    return ok(response.value)
  }
}

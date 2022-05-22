/**
 * Use Cases
 */
import { ISignUpUseCase } from '@/use-cases/ports'

/**
 * Presentation
 */
import { HttpRequest, HttpResponse } from '@/presentation/ports'
import { WebController } from './web-controller'
import { created } from '@/presentation/helpers/http-helper'

export class SignUpController extends WebController {
  private readonly signUpUseCase: ISignUpUseCase

  public override requiredHeaderParams: string[] = ['host']
  public override requiredParams: string[] = ['email', 'password', 'taxvat', 'name', 'lastname']

  constructor (signUpUseCase: ISignUpUseCase) {
    super()
    this.signUpUseCase = signUpUseCase
  }

  public async perform (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.signUpUseCase.perform(request.body, request.headers.host)

    if (response.isLeft()) {
      throw response.value
    }

    return created(response.value)
  }
}

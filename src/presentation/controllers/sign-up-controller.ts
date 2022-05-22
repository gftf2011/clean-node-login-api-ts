/**
 * Use Cases
 */
import { ISignUpUseCase } from '@/use-cases/ports'

/**
 * Presentation
 */
import { HttpResponse, HttpRequest, ControllerOperation } from '@/presentation/ports'
import { created } from '@/presentation/helpers/http-helper'

export class SignUpController implements ControllerOperation {
  readonly requiredParams = ['email', 'password', 'taxvat', 'name', 'lastname']
  readonly requiredHeaderParams = ['host']
  private readonly signUpUseCase: ISignUpUseCase

  constructor (signUpUseCase: ISignUpUseCase) {
    this.signUpUseCase = signUpUseCase
  }

  async operation (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.signUpUseCase.perform(request.body, request.headers.host)

    if (response.isLeft()) {
      throw response.value
    }

    return created(response.value)
  }
}

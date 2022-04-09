/**
 * Shared
 */
import { MissingParamsError } from '@/shared/errors'

/**
 * Presentation
 */
import { HttpResponse, HttpRequest, ControllerOperation } from '@/presentation/ports'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'

export class WebController {
  private readonly controllerOperation: ControllerOperation

  constructor (controllerOperation: ControllerOperation) {
    this.controllerOperation = controllerOperation
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string[] = WebController.getMissingParams(request, this.controllerOperation.requiredParams)
      if (missingParams.length !== 0) {
        return badRequest(new MissingParamsError(missingParams))
      }
      return await this.controllerOperation.operation(request)
    } catch (error) {
      return serverError(error as Error)
    }
  }

  public static getMissingParams (request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams: string[] = []
    requiredParams.forEach((name) => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name)
      }
    })
    return missingParams
  }
}

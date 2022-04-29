/**
 * Shared
 */
import { MissingParamsError } from '@/shared/errors'

/**
 * Presentation
 */
import { HttpResponse, HttpRequest, ControllerOperation } from '@/presentation/ports'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm that handles the data presentation.
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export class WebController {
  private readonly controllerOperation: ControllerOperation

  constructor (controllerOperation: ControllerOperation) {
    this.controllerOperation = controllerOperation
  }

  /**
   * @desc handles the user input
   * @param {HttpRequest} request - data input which comes from the `client`
   * @returns {Promise<HttpResponse>} data output after operation
   */
  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string[] = WebController.getMissingParams(request, this.controllerOperation.requiredParams)
      if (missingParams.length !== 0) {
        return badRequest(new MissingParamsError(missingParams))
      }
      const response = await this.controllerOperation.operation(request)
      return response
    } catch (error) {
      return serverError(error as Error)
    }
  }

  /**
   * @desc check which parameters are missing
   * @param {HttpRequest} request - data input which comes from the `client`
   * @param {string[]} requiredParams - required parameters which must be sent
   * @returns {string[]} array of missing parameters
   */
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

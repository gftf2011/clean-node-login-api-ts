/**
 * Presentation
 */
import { Controller, HttpRequest, HttpResponse } from '../../ports'

/**
 * Shared
 */
import {
  Error400,
  Error401,
  Error403,
  MissingHeaderParamsError,
  MissingParamsError,
} from '../../../shared/errors'

/**
 * Presentation
 */
import {
  badRequest,
  forbidden,
  serverError,
  unauthorized,
} from '../../helpers/http-helper'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm that handles the data presentation.
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export abstract class WebController implements Controller {
  public requiredParams: string[] = []
  public requiredHeaderParams: string[] = []

  /**
   * @desc handles throwable errors returned by the applicaion
   * @param {Error} err - error thrown by the application
   * @returns {HttpResponse} data output after operation
   */
  private static handleError(err: Error): HttpResponse {
    if (err instanceof Error400) {
      return badRequest(err)
    }
    if (err instanceof Error401) {
      return unauthorized(err)
    }
    if (err instanceof Error403) {
      return forbidden(err)
    }
    return serverError(err)
  }

  /**
   * @desc handles the user input
   * @param {HttpRequest} request - data input which comes from the `client`
   * @returns {Promise<HttpResponse>} data output after operation
   */
  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string[] = WebController.getMissingParams(
        request,
        this.requiredParams
      )
      if (missingParams.length !== 0) {
        throw new MissingParamsError(missingParams)
      }
      const missingHeaderParams: string[] =
        WebController.getMissingHeaderParams(request, this.requiredHeaderParams)
      if (missingHeaderParams.length !== 0) {
        throw new MissingHeaderParamsError(missingHeaderParams)
      }
      const response = await this.perform(request)
      return response
    } catch (error) {
      return WebController.handleError(error as Error)
    }
  }

  public abstract perform(request: HttpRequest): Promise<HttpResponse>

  /**
   * @desc check which parameters are missing
   * @param {HttpRequest} request - data input which comes from the `client`
   * @param {string[]} requiredParams - required parameters which must be sent
   * @returns {string[]} array of missing parameters
   */
  public static getMissingParams(
    request: HttpRequest,
    requiredParams: string[]
  ): string[] {
    const missingParams: string[] = []
    requiredParams.forEach((name) => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name)
      }
    })
    return missingParams
  }

  /**
   * @desc check which parameters are missing in the headers request
   * @param {HttpRequest} request - data input which comes from the `client`
   * @param {string[]} requiredHeaderParams - required parameters which must be sent in the headers request
   * @returns {string[]} array of missing parameters
   */
  public static getMissingHeaderParams(
    request: HttpRequest,
    requiredHeaderParams: string[]
  ): string[] {
    const missingParams: string[] = []
    requiredHeaderParams.forEach((name) => {
      if (!Object.keys(request.headers).includes(name)) {
        missingParams.push(name)
      }
    })
    return missingParams
  }
}

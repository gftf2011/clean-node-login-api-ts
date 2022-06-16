/**
 * Presentation
 */
import { Controller, Request } from '../../ports'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm that handles the data presentation.
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/template-method Template Method} design pattern
 */
export abstract class WebController implements Controller {
  public requiredParams: string[] = []

  /**
   * @desc handles the user input
   * @param {HttpRequest} request - data input which comes from the `client`
   * @returns {Promise<HttpResponse>} data output after operation
   */
  public async handle (request: Request): Promise<void> {
    try {
      const missingParams: string[] = WebController.getMissingParams(request, this.requiredParams)
      if (missingParams.length === 0) {
        await this.perform(request)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public abstract perform (request: Request): Promise<void>

  /**
   * @desc check which parameters are missing
   * @param {HttpRequest} request - data input which comes from the `client`
   * @param {string[]} requiredParams - required parameters which must be sent
   * @returns {string[]} array of missing parameters
   */
  public static getMissingParams (request: Request, requiredParams: string[]): string[] {
    const missingParams: string[] = []
    requiredParams.forEach((name) => {
      if (!Object.keys(request.content).includes(name)) {
        missingParams.push(name)
      }
    })
    return missingParams
  }
}

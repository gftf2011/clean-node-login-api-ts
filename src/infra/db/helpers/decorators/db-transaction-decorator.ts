/**
 * Presentation
 */
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports'

/**
 * Infrastructure
 */
import { DbClientManager } from '@/infra/contracts'

export class DbTransactionDecorator implements Controller {
  constructor (private readonly decoratee: Controller, private readonly dbClientManager: DbClientManager) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.dbClientManager.createClient()
      await this.dbClientManager.openTransaction()
      const response = await this.decoratee.handle(httpRequest)
      await this.dbClientManager.commit()
      await this.dbClientManager.closeTransaction()
      return response
    } catch (err) {
      await this.dbClientManager.rollback()
      await this.dbClientManager.closeTransaction()
      throw err
    }
  }
}

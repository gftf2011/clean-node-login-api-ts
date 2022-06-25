/**
 * Infra
 */
import { IQueueBuilder } from '../../../contracts'

export class QueueDirector {
  private builder: IQueueBuilder

  public setBuilder(builder: IQueueBuilder): void {
    this.builder = builder
  }

  public getQueueConnection(): any {
    this.builder.setHost()
    this.builder.setPass()
    this.builder.setPort()
    this.builder.setUser()

    return this.builder.build()
  }
}

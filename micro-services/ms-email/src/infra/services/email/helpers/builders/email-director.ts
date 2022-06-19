/**
 * Infra
 */
import { IEmailTransporterBuilder } from '../../../../contracts'

export class EmailDirector {
  private builder: IEmailTransporterBuilder

  public setBuilder (builder: IEmailTransporterBuilder): void {
    this.builder = builder
  }

  public getEmailTransporter (): any {
    this.builder.setHost()
    this.builder.setPass()
    this.builder.setPort()
    this.builder.setUser()

    return this.builder.build()
  }
}

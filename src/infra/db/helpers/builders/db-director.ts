/**
 * Entities
 */
import { IDbClientBuilder, IDbDirector } from '@/infra/contracts'

export class DbDirector implements IDbDirector {
  private builder?: IDbClientBuilder

  /**
   *
   * @param builder
   */
  public setBuilder (builder: IDbClientBuilder): void {
    this.builder = builder
  }

  public build (): void {
    this.builder?.setDb()
    this.builder?.setHost()
    this.builder?.setMax()
    this.builder?.setPass()
    this.builder?.setPort()
    this.builder?.setUser()
  }
}

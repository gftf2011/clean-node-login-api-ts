/**
 * Infra
 */
import { IDbClientBuilder } from '../../../contracts';

export class DbDirector {
  private builder: IDbClientBuilder;

  public setBuilder(builder: IDbClientBuilder): void {
    this.builder = builder;
  }

  public getDbClient(): any {
    this.builder.setDb();
    this.builder.setHost();
    this.builder.setMax();
    this.builder.setPass();
    this.builder.setPort();
    this.builder.setUser();

    return this.builder.build();
  }
}

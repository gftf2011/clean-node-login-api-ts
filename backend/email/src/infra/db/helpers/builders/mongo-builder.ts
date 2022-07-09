/**
 * Driver
 */
import { MongoClient } from 'mongodb';

/**
 * Infra
 */
// eslint-disable-next-line sort-imports
import { IDbClientBuilder } from '../../../contracts';

export class MongoClientBuilder implements IDbClientBuilder {
  private product: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    max?: number;
    db?: string;
  };

  public constructor() {
    this.reset();
  }

  private reset(): void {
    this.product = {};
  }

  public setHost(): void {
    this.product.host = process.env.MONGO_HOST;
  }

  public setPort(): void {
    this.product.port = +process.env.MONGO_PORT;
  }

  public setUser(): void {
    this.product.user = process.env.MONGO_USER;
  }

  public setPass(): void {
    this.product.pass = process.env.MONGO_PASSWORD;
  }

  public setDb(): void {
    this.product.db = process.env.MONGO_DB;
  }

  public setMax(): void {
    this.product.max = +process.env.MONGO_MAX;
  }

  public build(): MongoClient {
    const result = new MongoClient(
      `mongodb://${this.product.user}:${this.product.pass}@${this.product.host}:${this.product.port}/${this.product.db}`,
      {
        maxPoolSize: this.product.max,
        authMechanism: 'SCRAM-SHA-256',
      },
    );
    this.reset();
    return result;
  }
}

/**
 * Infra
 */
import { DbQueryRunner } from '../../../contracts';

export class DbQueryRunnerContext {
  private strategy: DbQueryRunner;

  constructor(strategy: DbQueryRunner) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: DbQueryRunner): void {
    this.strategy = strategy;
  }

  public async executeQuery(
    tableOrCollection: string,
    ...args: any
  ): Promise<any> {
    return this.strategy.execute(tableOrCollection, ...args);
  }
}

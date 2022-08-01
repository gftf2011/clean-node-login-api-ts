/**
 * Infra
 */
import { IListBlacklistTaxvatDao } from '../../../../../../src/infra/contracts';

export class FakeInMemoryListBlacklistTaxvatDao
  implements IListBlacklistTaxvatDao
{
  constructor(private readonly blacklist: string[] = []) {}

  async execute(): Promise<string[]> {
    return this.blacklist as any;
  }
}

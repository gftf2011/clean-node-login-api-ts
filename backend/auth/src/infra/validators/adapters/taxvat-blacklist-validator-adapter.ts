/**
 * Infra
 */
import { IListBlacklistTaxvatDao } from '../../contracts';

/**
 * Validation
 */
import { ITaxvatBlacklistValidator } from '../../../validation/ports';

export class TaxvatBlacklistValidatorAdapter
  implements ITaxvatBlacklistValidator
{
  constructor(
    private readonly listBlacklistTaxvatDao: IListBlacklistTaxvatDao,
  ) {}

  async isValid(taxvat: string): Promise<boolean> {
    const response = await this.listBlacklistTaxvatDao.execute();
    return !response.some(item => item === taxvat);
  }
}

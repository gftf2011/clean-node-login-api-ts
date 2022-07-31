/**
 * Infra
 */
import { IListBlacklistTaxvatDao } from '../../contracts';

/**
 * Validation
 */
import { IValidator } from '../../../validation/ports';

export class TaxvatBlacklistValidatorAdapter implements IValidator {
  constructor(
    private readonly listBlacklistTaxvatDao: IListBlacklistTaxvatDao,
  ) {}

  async isValid(taxvat: string): Promise<boolean> {
    const response = await this.listBlacklistTaxvatDao.execute();
    return !response.some(item => item === taxvat);
  }
}

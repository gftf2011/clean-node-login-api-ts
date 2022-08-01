/**
 * Validation
 */
import { IValidator } from '../../../../../../../src/validation/ports';

export class InvalidTaxvatInBlacklistValidatorAdapterStub
  implements IValidator
{
  async isValid(_taxvat: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}

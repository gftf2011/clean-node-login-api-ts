/**
 * Validation
 */
import { IValidator } from '../../../../../../../src/validation/ports';

export class InvalidTaxvatInBlacklistValidatorAdapterStub
  implements IValidator
{
  async isValid(taxvat: string): Promise<boolean> {
    return false;
  }
}

/**
 * Validation
 */
import { IValidator } from '../../../../../../../src/validation/ports';

export class NoTaxvatInBlacklistValidatorAdapterStub implements IValidator {
  async isValid(taxvat: string): Promise<boolean> {
    return true;
  }
}

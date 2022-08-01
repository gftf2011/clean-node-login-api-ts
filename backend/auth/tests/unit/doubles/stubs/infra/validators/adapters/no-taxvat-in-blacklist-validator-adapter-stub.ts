/**
 * Validation
 */
import { IValidator } from '../../../../../../../src/validation/ports';

export class NoTaxvatInBlacklistValidatorAdapterStub implements IValidator {
  async isValid(_taxvat: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

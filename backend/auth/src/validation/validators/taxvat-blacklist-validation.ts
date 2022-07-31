/**
 * Validation
 */
import { IValidator, Validation } from '../ports';

/**
 * Shared
 */
import { InvalidParamError } from '../../shared/errors';

export class TaxvatBlacklistValidation implements Validation {
  constructor(
    private readonly taxvat: string,
    private readonly taxvatBlacklistValidator: IValidator,
  ) {}

  async validate(): Promise<void> {
    const isValid = await this.taxvatBlacklistValidator.isValid(this.taxvat);
    if (!isValid) {
      throw new InvalidParamError(this.taxvat);
    }
  }
}

/**
 * Validation
 */
import { ITaxvatBlacklistValidator } from '../ports';

/**
 * Shared
 */
import { InvalidParamError } from '../../shared/errors';

/**
 * Presentation
 */
import { Validation } from '../../presentation/ports';

export class TaxvatBlacklistValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly taxvatBlacklistValidator: ITaxvatBlacklistValidator,
  ) {}

  async validate(input: any): Promise<void> {
    const isValid = await this.taxvatBlacklistValidator.isValid(
      input[this.fieldName],
    );
    if (!isValid) {
      throw new InvalidParamError(this.fieldName);
    }
  }
}

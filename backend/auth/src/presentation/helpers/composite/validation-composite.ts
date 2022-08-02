import { Validation } from '../../../validation';

/**
 * @author Rodrigo Manguinho <rodrigo.manguinho@gmail.com>
 * @desc Compose a linear list structure validation with the same contract
 * It uses the {@link https://refactoring.guru/design-patterns/composite Composite} design pattern
 */
export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  /**
   * @author Rodrigo Manguinho <rodrigo.manguinho@gmail.com>
   * @desc perform a loop validation
   * @returns {Promise<void>} returns nothing or throws error
   */
  async validate(): Promise<void> {
    await Promise.all(
      this.validations.map(async validation => {
        await validation.validate();
      }),
    );
  }
}

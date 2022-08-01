import { Validation } from '../../../validation';

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  async validate(): Promise<void> {
    await Promise.all(
      this.validations.map(async validation => {
        await validation.validate();
      }),
    );
  }
}

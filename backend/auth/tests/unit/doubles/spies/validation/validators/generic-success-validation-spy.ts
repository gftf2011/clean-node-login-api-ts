/**
 * Validation
 */
import { Validation } from '../../../../../../src/validation';

export class GenericSuccessValidationSpy implements Validation {
  private countValidate = 0;

  getCountValidate(): number {
    return this.countValidate;
  }

  async validate(): Promise<void> {
    this.countValidate++;
    return {} as any;
  }
}

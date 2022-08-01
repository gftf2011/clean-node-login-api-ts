/**
 * Spies
 */
import { GenericSuccessValidationSpy } from '../../../doubles/spies';

/**
 * Validation
 */
import { ValidationComposite } from '../../../../../src/presentation/helpers/composite/validation-composite';

describe('Validation Composite', () => {
  it('should call all validators', async () => {
    const spy = new GenericSuccessValidationSpy();
    const sut = new ValidationComposite([spy]);

    await sut.validate();

    expect(spy.getCountValidate()).toBe(1);
  });
});

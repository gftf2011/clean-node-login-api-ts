/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import {
  Error400,
  MissingHeaderParamsError,
} from '../../../../src/shared/errors';

describe('Missing Header Params Error', () => {
  let sut: MissingHeaderParamsError;
  let parameters: string[];

  beforeEach(() => {
    parameters = faker.lorem
      .words(faker.datatype.number({ min: 2, max: 5 }))
      .split(' ');
    sut = new MissingHeaderParamsError(parameters);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(
      `Header parameters are missing: [${parameters.join(', ')}]`,
    );
  });

  it('should return error name', () => {
    expect(sut.name).toBe('MissingHeaderParamsError');
  });
});

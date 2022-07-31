/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidParamError } from '../../../../src/shared/errors';

describe('Invalid Param Error', () => {
  let sut: InvalidParamError;
  let parameter: string;

  beforeEach(() => {
    parameter = faker.lorem.word();
    sut = new InvalidParamError(parameter);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`Parameter: ${parameter} is invalid`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidParamError');
  });
});

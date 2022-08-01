/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidNameError } from '../../../../src/shared/errors';

describe('Invalid Name Error', () => {
  let sut: InvalidNameError;
  let name: string;

  beforeEach(() => {
    name = faker.name.firstName();
    sut = new InvalidNameError(name);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`The name '${name}' is not valid`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidNameError');
  });
});

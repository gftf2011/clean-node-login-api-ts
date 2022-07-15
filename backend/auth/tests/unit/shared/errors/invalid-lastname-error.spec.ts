/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidLastnameError } from '../../../../src/shared/errors';

describe('Invalid Lastname Error', () => {
  let sut: InvalidLastnameError;
  let lastname: string;

  beforeEach(() => {
    lastname = faker.name.lastName();
    sut = new InvalidLastnameError(lastname);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`The lastname '${lastname}' is not valid`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidLastnameError');
  });
});

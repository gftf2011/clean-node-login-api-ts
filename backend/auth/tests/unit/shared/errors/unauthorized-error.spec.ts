/**
 * Shared
 */
import { Error401, UnauthorizedError } from '../../../../src/shared/errors';

describe('Unauthorized Error', () => {
  let sut: UnauthorizedError;

  beforeEach(() => {
    sut = new UnauthorizedError();
  });

  it('should extend Error401', () => {
    expect(sut).toBeInstanceOf(Error401);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`Unauthorized to access resource`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('UnauthorizedError');
  });
});

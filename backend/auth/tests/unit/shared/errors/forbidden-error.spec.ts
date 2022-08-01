/**
 * Shared
 */
import { Error403, ForbiddenError } from '../../../../src/shared/errors';

describe('Forbidden Error', () => {
  let sut: ForbiddenError;

  beforeEach(() => {
    sut = new ForbiddenError();
  });

  it('should extend Error403', () => {
    expect(sut).toBeInstanceOf(Error403);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`Forbidden to access resource`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('ForbiddenError');
  });
});

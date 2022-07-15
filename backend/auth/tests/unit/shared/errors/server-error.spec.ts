/**
 * Shared
 */
import { Error500, ServerError } from '../../../../src/shared/errors';

describe('Server Error', () => {
  let sut: ServerError;

  beforeEach(() => {
    sut = new ServerError();
  });

  it('should extend Error500', () => {
    expect(sut).toBeInstanceOf(Error500);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`Server is not responding`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('ServerError');
  });
});

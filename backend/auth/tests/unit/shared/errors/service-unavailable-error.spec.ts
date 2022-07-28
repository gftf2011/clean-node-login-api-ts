/**
 * Shared
 */
import {
  Error503,
  ServiceUnavailableError,
} from '../../../../src/shared/errors';

describe('Service Unavailable Error', () => {
  let sut: ServiceUnavailableError;

  beforeEach(() => {
    sut = new ServiceUnavailableError();
  });

  it('should extend Error503', () => {
    expect(sut).toBeInstanceOf(Error503);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`Resource is not available`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('ServiceUnavailableError');
  });
});

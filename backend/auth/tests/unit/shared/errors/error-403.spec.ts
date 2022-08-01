/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error403 } from '../../../../src/shared/errors';

describe('Error 403', () => {
  let sut: Error403;

  beforeEach(() => {
    sut = new Error403();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

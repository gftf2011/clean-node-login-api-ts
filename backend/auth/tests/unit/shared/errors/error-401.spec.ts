/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error401 } from '../../../../src/shared/errors';

describe('Error 401', () => {
  let sut: Error401;

  beforeEach(() => {
    sut = new Error401();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

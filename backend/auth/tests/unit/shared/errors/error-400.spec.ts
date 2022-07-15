/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400 } from '../../../../src/shared/errors';

describe('Invalid Email Error', () => {
  let sut: Error400;

  beforeEach(() => {
    sut = new Error400();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

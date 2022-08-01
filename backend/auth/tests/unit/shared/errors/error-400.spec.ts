/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400 } from '../../../../src/shared/errors';

describe('Error 400', () => {
  let sut: Error400;

  beforeEach(() => {
    sut = new Error400();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

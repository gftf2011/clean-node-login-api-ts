/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error500 } from '../../../../src/shared/errors';

describe('Error 500', () => {
  let sut: Error500;

  beforeEach(() => {
    sut = new Error500();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

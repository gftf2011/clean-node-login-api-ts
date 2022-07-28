/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error503 } from '../../../../src/shared/errors';

describe('Error 503', () => {
  let sut: Error503;

  beforeEach(() => {
    sut = new Error503();
  });

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error);
  });
});

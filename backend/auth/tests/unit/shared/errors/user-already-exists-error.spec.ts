/**
 * Shared
 */
import {
  Error403,
  UserAlreadyExistsError,
} from '../../../../src/shared/errors';

describe('User Already Exists Error', () => {
  let sut: UserAlreadyExistsError;

  beforeEach(() => {
    sut = new UserAlreadyExistsError();
  });

  it('should extend Error403', () => {
    expect(sut).toBeInstanceOf(Error403);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`The user already exists`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('UserAlreadyExistsError');
  });
});

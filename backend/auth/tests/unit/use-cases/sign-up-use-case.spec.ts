/**
 * Use Cases
 */
import { ISignUpUseCase } from '../../../src/use-cases/ports';

/**
 * Shared
 */
import { ServerError } from '../../../src/shared/errors';

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../src/use-cases';

describe('Sign-Up Use Case', () => {
  const OLD_ENV = process.env;

  let sut: ISignUpUseCase;

  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.resetModules();
    /**
     * Make a copy
     */
    process.env = { ...OLD_ENV };
  });

  it('should throw server error if CODE_SALT env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.CODE_SALT = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  afterAll(() => {
    /**
     * Restore old environment
     */
    process.env = OLD_ENV;
  });
});

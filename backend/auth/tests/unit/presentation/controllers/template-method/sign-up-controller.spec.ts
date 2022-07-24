/**
 * Presentation
 */
import { Controller } from '../../../../../src/presentation/ports';
// eslint-disable-next-line sort-imports
import {
  SignUpController,
  WebController,
} from '../../../../../src/presentation/controllers';

/**
 * Use-Cases
 */
import { ISignUpUseCase } from '../../../../../src/use-cases/ports';

/**
 * Dummies
 */
import { SignUpUseCaseDummy } from '../../../doubles/dummies';

// eslint-disable-next-line no-shadow
enum SIGN_UP_USE_CASE_TYPE {
  DUMMY = 'DUMMY',
}

const makeSignUpUseCase = (type: SIGN_UP_USE_CASE_TYPE): ISignUpUseCase => {
  switch (type) {
    case SIGN_UP_USE_CASE_TYPE.DUMMY:
      return new SignUpUseCaseDummy();
    default:
      return new SignUpUseCaseDummy();
  }
};

const makeSut = (signUpType: SIGN_UP_USE_CASE_TYPE): Controller => {
  const signUpDouble = makeSignUpUseCase(signUpType);

  const sut = new SignUpController(signUpDouble);

  return sut;
};

describe('Sign-Up Controller', () => {
  let sut: Controller;

  beforeEach(() => {
    sut = makeSut(SIGN_UP_USE_CASE_TYPE.DUMMY);
  });

  it('should extend WebController', () => {
    expect(sut).toBeInstanceOf(WebController);
  });

  afterEach(() => {
    sut = {} as any;
  });
});

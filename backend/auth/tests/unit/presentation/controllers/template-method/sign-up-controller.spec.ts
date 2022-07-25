/* eslint-disable sort-imports */
/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Presentation
 */
import { Controller, HttpRequest } from '../../../../../src/presentation/ports';
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

/**
 * Stubs
 */
import {
  PerformServerErrorSignUpUseCaseStub,
  PerformUnauthorizedErrorSignUpUseCaseStub,
} from '../../../doubles/stubs';

/**
 * Spies
 */
import { PerformSuccessSignUpUseCaseSpy } from '../../../doubles/spies';

/**
 * Shared
 */
import {
  MissingHeaderParamsError,
  MissingParamsError,
  ServerError,
  UnauthorizedError,
} from '../../../../../src/shared/errors';

// eslint-disable-next-line no-shadow
enum SIGN_UP_USE_CASE_TYPE {
  DUMMY = 'DUMMY',
  STUB_PERFORM_SERVER_ERROR = 'STUB_PERFORM_SERVER_ERROR',
  STUB_PERFORM_UNAUTHORIZED_ERROR = 'STUB_PERFORM_UNAUTHORIZED_ERROR',
  SPY_PERFORM_SUCCESS = 'SPY_PERFORM_SUCCESS',
}

const makeSignUpUseCase = (type: SIGN_UP_USE_CASE_TYPE): any => {
  switch (type) {
    case SIGN_UP_USE_CASE_TYPE.DUMMY:
      return new SignUpUseCaseDummy();
    case SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SERVER_ERROR:
      return new PerformServerErrorSignUpUseCaseStub();
    case SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_UNAUTHORIZED_ERROR:
      return new PerformUnauthorizedErrorSignUpUseCaseStub();
    case SIGN_UP_USE_CASE_TYPE.SPY_PERFORM_SUCCESS:
      return new PerformSuccessSignUpUseCaseSpy();
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

  it('should return missing param error if email request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        taxvat: cpf.generate(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamsError(['email']),
    });
  });

  it('should return missing param error if password request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        email: faker.internet.email(),
        taxvat: cpf.generate(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamsError(['password']),
    });
  });

  it('should return missing param error if taxvat request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamsError(['taxvat']),
    });
  });

  it('should return missing param error if name request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamsError(['name']),
    });
  });

  it('should return missing param error if name request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamsError(['lastname']),
    });
  });

  it('should return missing header param error if host request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {},
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingHeaderParamsError(['host']),
    });
  });

  it('should return server error if use case returns server error', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await makeSut(
      SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SERVER_ERROR,
    ).handle(request);

    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });

  it('should return unauthorized error if use case returns unauthorized error', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await makeSut(
      SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_UNAUTHORIZED_ERROR,
    ).handle(request);

    expect(response).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });

  it('should return created account', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: cpf.generate(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const spySignUpUseCase = makeSignUpUseCase(
      SIGN_UP_USE_CASE_TYPE.SPY_PERFORM_SUCCESS,
    );

    sut = new SignUpController(spySignUpUseCase);

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 201,
      body: spySignUpUseCase.getParameters().perform.response[0].value,
    });
  });

  afterEach(() => {
    sut = {} as any;
  });
});

/* eslint-disable sort-imports */
/**
 * Driver
 */
import faker from 'faker';

/**
 * Presentation
 */
import { Controller, HttpRequest } from '../../../../../src/presentation/ports';
import {
  SignInController,
  WebController,
} from '../../../../../src/presentation/controllers';

/**
 * Dummies
 */
import { SignInUseCaseDummy } from '../../../doubles/dummies';

/**
 * Stubs
 */
import {
  PerformForbiddenErrorSignInUseCaseStub,
  PerformServerErrorSignInUseCaseStub,
  PerformUnauthorizedErrorSignInUseCaseStub,
  PerformSuccessSignInUseCaseStub,
} from '../../../doubles/stubs';

/**
 * Shared
 */
import {
  ForbiddenError,
  MissingHeaderParamsError,
  MissingParamsError,
  ServerError,
  UnauthorizedError,
} from '../../../../../src/shared/errors';

enum SIGN_IN_USE_CASE_TYPE {
  DUMMY = 'DUMMY',
  STUB_PERFORM_SERVER_ERROR = 'STUB_PERFORM_SERVER_ERROR',
  STUB_PERFORM_UNAUTHORIZED_ERROR = 'STUB_PERFORM_UNAUTHORIZED_ERROR',
  STUB_PERFORM_FORBIDDEN_ERROR = 'STUB_PERFORM_FORBIDDEN_ERROR',
  STUB_PERFORM_SUCCESS = 'STUB_PERFORM_SUCCESS',
}

const makeSignInUseCase = (type: SIGN_IN_USE_CASE_TYPE): any => {
  switch (type) {
    case SIGN_IN_USE_CASE_TYPE.DUMMY:
      return new SignInUseCaseDummy();
    case SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_SERVER_ERROR:
      return new PerformServerErrorSignInUseCaseStub();
    case SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_UNAUTHORIZED_ERROR:
      return new PerformUnauthorizedErrorSignInUseCaseStub();
    case SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_FORBIDDEN_ERROR:
      return new PerformForbiddenErrorSignInUseCaseStub();
    case SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_SUCCESS:
      return new PerformSuccessSignInUseCaseStub();
    default:
      return new SignInUseCaseDummy();
  }
};

const makeSut = (signInType: SIGN_IN_USE_CASE_TYPE): Controller => {
  const signInDouble = makeSignInUseCase(signInType);

  const sut = new SignInController(signInDouble);

  return sut;
};

describe('Sign-In Controller', () => {
  let sut: Controller;

  beforeEach(() => {
    sut = makeSut(SIGN_IN_USE_CASE_TYPE.DUMMY);
  });

  it('should extend WebController', () => {
    expect(sut).toBeInstanceOf(WebController);
  });

  it('should return missing param error if email request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
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

  it('should return missing header param error if host request parameter is missing', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        email: faker.internet.email(),
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
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await makeSut(
      SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_SERVER_ERROR,
    ).handle(request);

    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });

  it('should return unauthorized error if use case returns unauthorized error', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await makeSut(
      SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_UNAUTHORIZED_ERROR,
    ).handle(request);

    expect(response).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });

  it('should return forbidden error if use case returns forbidden error', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const response = await makeSut(
      SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_FORBIDDEN_ERROR,
    ).handle(request);

    expect(response).toEqual({
      statusCode: 403,
      body: new ForbiddenError(),
    });
  });

  it('should return created account', async () => {
    const request: HttpRequest = {
      body: {
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    const stubSignInUseCase = makeSignInUseCase(
      SIGN_IN_USE_CASE_TYPE.STUB_PERFORM_SUCCESS,
    );

    sut = new SignInController(stubSignInUseCase);

    const response = await sut.handle(request);

    const body = (
      await stubSignInUseCase.perform(request.body, request.headers?.host)
    ).value;

    expect(response).toEqual({
      statusCode: 200,
      body,
    });
  });

  afterEach(() => {
    sut = {} as any;
  });
});

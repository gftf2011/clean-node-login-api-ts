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
 * Dummies
 */
import { SignUpUseCaseDummy } from '../../../doubles/dummies';

/**
 * Stubs
 */
import {
  PerformServerErrorSignUpUseCaseStub,
  PerformUnauthorizedErrorSignUpUseCaseStub,
  PerformSuccessSignUpUseCaseStub,
  NoTaxvatInBlacklistValidatorAdapterStub,
  InvalidTaxvatInBlacklistValidatorAdapterStub,
} from '../../../doubles/stubs';

/**
 * Shared
 */
import {
  InvalidParamError,
  MissingHeaderParamsError,
  MissingParamsError,
  ServerError,
  UnauthorizedError,
} from '../../../../../src/shared/errors';

enum SIGN_UP_USE_CASE_TYPE {
  DUMMY = 'DUMMY',
  STUB_PERFORM_SERVER_ERROR = 'STUB_PERFORM_SERVER_ERROR',
  STUB_PERFORM_UNAUTHORIZED_ERROR = 'STUB_PERFORM_UNAUTHORIZED_ERROR',
  STUB_PERFORM_SUCCESS = 'STUB_PERFORM_SUCCESS',
}

enum VALIDATOR_TYPE {
  STUB_NO_TAXVAT_IN_BLACKLIST_PARAM = 'STUB_NO_TAXVAT_IN_BLACKLIST_PARAM',
  STUB_INVALID_TAXVAT_IN_BLACKLIST_PARAM = 'STUB_INVALID_TAXVAT_IN_BLACKLIST_PARAM',
}

const makeValidator = (type: VALIDATOR_TYPE): any => {
  switch (type) {
    case VALIDATOR_TYPE.STUB_NO_TAXVAT_IN_BLACKLIST_PARAM:
      return new NoTaxvatInBlacklistValidatorAdapterStub();
    case VALIDATOR_TYPE.STUB_INVALID_TAXVAT_IN_BLACKLIST_PARAM:
      return new InvalidTaxvatInBlacklistValidatorAdapterStub();
    default:
      return new NoTaxvatInBlacklistValidatorAdapterStub();
  }
};

const makeSignUpUseCase = (type: SIGN_UP_USE_CASE_TYPE): any => {
  switch (type) {
    case SIGN_UP_USE_CASE_TYPE.DUMMY:
      return new SignUpUseCaseDummy();
    case SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SERVER_ERROR:
      return new PerformServerErrorSignUpUseCaseStub();
    case SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_UNAUTHORIZED_ERROR:
      return new PerformUnauthorizedErrorSignUpUseCaseStub();
    case SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SUCCESS:
      return new PerformSuccessSignUpUseCaseStub();
    default:
      return new SignUpUseCaseDummy();
  }
};

const makeSut = (
  signUpType: SIGN_UP_USE_CASE_TYPE,
  validatorsType: VALIDATOR_TYPE[],
): Controller => {
  const validatorDouble = validatorsType.map(validatorType =>
    makeValidator(validatorType),
  );
  const signUpDouble = makeSignUpUseCase(signUpType);

  const sut = new SignUpController(signUpDouble, validatorDouble);

  return sut;
};

const generateBlacklistedTaxvat = (): string => {
  const taxvatBlacklist = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];
  return taxvatBlacklist[
    Math.round((taxvatBlacklist.length - 1) * Math.random())
  ];
};

describe('Sign-Up Controller', () => {
  let sut: Controller;

  beforeEach(() => {
    sut = makeSut(SIGN_UP_USE_CASE_TYPE.DUMMY, [
      VALIDATOR_TYPE.STUB_NO_TAXVAT_IN_BLACKLIST_PARAM,
    ]);
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
      [VALIDATOR_TYPE.STUB_NO_TAXVAT_IN_BLACKLIST_PARAM],
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
      [VALIDATOR_TYPE.STUB_NO_TAXVAT_IN_BLACKLIST_PARAM],
    ).handle(request);

    expect(response).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });

  it('should return invalid param error if taxvat is in blacklist', async () => {
    const request: HttpRequest = {
      body: {
        taxvat: generateBlacklistedTaxvat(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
      },
      headers: {
        host: faker.internet.ip(),
      },
    };

    sut = makeSut(SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SUCCESS, [
      VALIDATOR_TYPE.STUB_INVALID_TAXVAT_IN_BLACKLIST_PARAM,
    ]);

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 400,
      body: new InvalidParamError(request.body.taxvat),
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

    const stubSignUpUseCase = makeSignUpUseCase(
      SIGN_UP_USE_CASE_TYPE.STUB_PERFORM_SUCCESS,
    );

    const stubValidator = makeValidator(
      VALIDATOR_TYPE.STUB_NO_TAXVAT_IN_BLACKLIST_PARAM,
    );

    sut = new SignUpController(stubSignUpUseCase, [stubValidator]);

    const response = await sut.handle(request);

    const body = (
      await stubSignUpUseCase.perform(request.body, request.headers?.host)
    ).value;

    expect(response).toEqual({
      statusCode: 201,
      body,
    });
  });

  afterEach(() => {
    sut = {} as any;
  });
});

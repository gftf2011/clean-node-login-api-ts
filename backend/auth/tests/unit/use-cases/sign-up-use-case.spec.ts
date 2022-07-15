/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Use Cases
 */
// eslint-disable-next-line sort-imports
import { BasicUserDto, ISignUpUseCase } from '../../../src/use-cases/ports';

/**
 * Shared
 */
import {
  InvalidEmailError,
  InvalidNameError,
  ServerError,
} from '../../../src/shared/errors';

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../src/use-cases';

describe('Sign-Up Use Case', () => {
  let OLD_ENV: NodeJS.ProcessEnv;

  let sut: ISignUpUseCase;

  beforeAll(() => {
    process.env.CODE_SALT = faker.datatype.hexaDecimal(504);
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = `${faker.datatype.number({
      min: 1000000,
      max: 9999999,
    })}`;
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = `${faker.datatype.number({
      min: 10000000,
      max: 99999999,
    })}`;
    process.env.JWT_ACCESS_TOKEN_ID = faker.datatype.uuid();
    process.env.JWT_REFRESH_TOKEN_ID = faker.datatype.uuid();
    process.env.APP_SECRET = faker.datatype.uuid();

    OLD_ENV = process.env;
  });

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

  it('should throw server error if JWT_ACCESS_TOKEN_EXPIRES_IN env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_REFRESH_TOKEN_EXPIRES_IN env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_ACCESS_TOKEN_ID env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.JWT_ACCESS_TOKEN_ID = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_REFRESH_TOKEN_ID env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.JWT_REFRESH_TOKEN_ID = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if APP_SECRET env is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    process.env.APP_SECRET = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw invalid email error if email is undefiend', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email: any = undefined;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email is null', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email: any = null;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = '';

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email property has more than 320 characters - (too many characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account property has more than 64 characters - (too many characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(65)}@${'d'.repeat(126)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain property has more than 255 characters - (too many characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has an ending dot', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(63)}.@${'d'.repeat(127)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has 0 characters - (too few characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `@${'d'.repeat(127)}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has 2 dots', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(31)}..${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has invalid character', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(32)} ${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain has 0 characters - (too few characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(64)}@`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain does not have a dot separator', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain has 2 dot separators', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}..${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain part has more than 127 characters - (too many characters)', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid name error if name is undefined', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const name: any = undefined;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name is null', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const name: any = null;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name is empty', async () => {
    sut = new SignUpUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const name = '';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: faker.internet.password(
        11,
        true,
        /^([0-9]{8})([a-z]{1})([A-Z]{1})([!@#$%&?]{1})$/,
      ),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  afterAll(() => {
    /**
     * Restore old environment
     */
    process.env = {};
  });
});

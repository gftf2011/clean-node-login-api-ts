/**
 * Driver
 */
import faker from 'faker';

/**
 * Use Cases
 */
// eslint-disable-next-line sort-imports
import { AccountDto, ISignInUseCase } from '../../../src/use-cases/ports';

/**
 * Shared
 */
import {
  ForbiddenError,
  InvalidEmailError,
  InvalidPasswordError,
  ServerError,
  UnauthorizedError,
} from '../../../src/shared/errors';

/**
 * Use Cases
 */
import { SignInUseCase } from '../../../src/use-cases';

/**
 * Fakes
 */
// eslint-disable-next-line sort-imports
import {
  FakeInMemoryUserRepository,
  FakeNoneEncryptService,
  FakeNoneHashService,
} from '../doubles/fakes';

/**
 * Stubs
 */
// eslint-disable-next-line sort-imports
import {
  NoJsonWebAlgorithmInSignUpTokenServiceStub,
  OnlyCallSamePasswordByParameterHashServiceStub,
  UserAlreadyExistsRepositoryStub,
} from '../doubles/stubs';

/**
 * Dummies
 */
// eslint-disable-next-line sort-imports
import {
  CryptoEncryptServiceDummy,
  CryptoHashServiceDummy,
  JWTTokenServiceDummy,
  UserRepositoryDummy,
} from '../doubles/dummies';

/**
 * Spies
 */
// eslint-disable-next-line sort-imports
import {
  CreateTokenServiceSpy,
  GenericEncryptServiceSpy,
  GenericHashServiceSpy,
  UserAlreadyExistsRepositorySpy,
  UserNotExistsRepositorySpy,
} from '../doubles/spies';

/**
 * Mocks
 */
import {
  OnlyFirstSignCallErrorTokenServiceMock,
  OnlySecondSignCallErrorTokenServiceMock,
} from '../doubles/mocks';

const generateValidPassword = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );
  return `${faker.datatype.number({
    min: 10000000,
    max: 99999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 2 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 2 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidShortPassword = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );
  return `${faker.datatype.number({
    min: 1000000,
    max: 9999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidLongPassword = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );
  return `${faker.datatype.number({
    min: 1000000000,
    max: 9999999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 7, max: 7 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 7, max: 7 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidPasswordWithWhiteSpace = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );

  const WHITE_SPACE = ' ';

  return `${faker.datatype.number({
    min: 10000000,
    max: 99999999,
  })}${WHITE_SPACE}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidPasswordWithFewNumbers = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );

  return `${faker.datatype.number({
    min: 1000000,
    max: 9999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 2, max: 2 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidPasswordWithNoCapitalLetters = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );

  return `${faker.datatype.number({
    min: 10000000,
    max: 99999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 2, max: 2 }))
    .toLowerCase()}${chosenSpecialSymbol}`;
};

const generateInvalidPasswordWithNoLowercaseLetters = (): string => {
  const specialSymbols = '!@#$%&?';
  /**
   * Code below will pick one of the special characters to be put in the password
   */
  const chosenSpecialSymbol = specialSymbols.charAt(
    Math.round((specialSymbols.length - 1) * Math.random()),
  );

  return `${faker.datatype.number({
    min: 10000000,
    max: 99999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 2, max: 2 }))
    .toUpperCase()}${chosenSpecialSymbol}`;
};

const generateInvalidPasswordWithNoSpecialChar = (): string => {
  return `${faker.datatype.number({
    min: 100000000,
    max: 999999999,
  })}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toLowerCase()}${faker.lorem
    .word(faker.datatype.number({ min: 1, max: 1 }))
    .toUpperCase()}`;
};

// eslint-disable-next-line no-shadow
enum USER_REPOSITORY_TYPE {
  DUMMY = 'DUMMY',
  STUB_USER_ALREADY_EXISTS = 'STUB_USER_ALREADY_EXISTS',
  FAKE_IN_MEMORY = 'FAKE_IN_MEMORY',
  SPY_USER_ALREADY_EXISTS = 'SPY_USER_ALREADY_EXISTS',
  SPY_USER_NOT_EXISTS = 'SPY_USER_NOT_EXISTS',
}

// eslint-disable-next-line no-shadow
enum HASH_SERVICE_TYPE {
  DUMMY = 'DUMMY',
  FAKE_NONE = 'FAKE_NONE',
  SPY_GENERIC = 'SPY_GENERIC',
  STUB_ONLY_CALL_SAME_PASSWORD = 'STUB_ONLY_CALL_SAME_PASSWORD',
}

// eslint-disable-next-line no-shadow
enum ENCRYPT_SERVICE_TYPE {
  DUMMY = 'DUMMY',
  FAKE_NONE = 'FAKE_NONE',
  SPY_GENERIC = 'SPY_GENERIC',
}

// eslint-disable-next-line no-shadow
enum TOKEN_SERVICE_TYPE {
  DUMMY = 'DUMMY',
  STUB_NO_JWA_IN_SIGN = 'STUB_NO_JWA_IN_SIGN',
  SPY_CREATE_TOKEN = 'SPY_CREATE_TOKEN',
  MOCK_ONLY_FIRST_SIGN_CALL = 'MOCK_ONLY_FIRST_SIGN_CALL',
  MOCK_ONLY_SECOND_SIGN_CALL = 'MOCK_ONLY_SECOND_SIGN_CALL',
}

const makeUserRepository = (type: USER_REPOSITORY_TYPE): any => {
  switch (type) {
    case USER_REPOSITORY_TYPE.DUMMY:
      return new UserRepositoryDummy();
    case USER_REPOSITORY_TYPE.FAKE_IN_MEMORY:
      return new FakeInMemoryUserRepository();
    case USER_REPOSITORY_TYPE.STUB_USER_ALREADY_EXISTS:
      return new UserAlreadyExistsRepositoryStub();
    case USER_REPOSITORY_TYPE.SPY_USER_ALREADY_EXISTS:
      return new UserAlreadyExistsRepositorySpy();
    case USER_REPOSITORY_TYPE.SPY_USER_NOT_EXISTS:
      return new UserNotExistsRepositorySpy();
    default:
      return new UserRepositoryDummy();
  }
};

const makeHashService = (type: HASH_SERVICE_TYPE): any => {
  switch (type) {
    case HASH_SERVICE_TYPE.DUMMY:
      return new CryptoHashServiceDummy();
    case HASH_SERVICE_TYPE.FAKE_NONE:
      return new FakeNoneHashService();
    case HASH_SERVICE_TYPE.SPY_GENERIC:
      return new GenericHashServiceSpy();
    case HASH_SERVICE_TYPE.STUB_ONLY_CALL_SAME_PASSWORD:
      return new OnlyCallSamePasswordByParameterHashServiceStub();
    default:
      return new CryptoHashServiceDummy();
  }
};

const makeEncryptService = (type: ENCRYPT_SERVICE_TYPE): any => {
  switch (type) {
    case ENCRYPT_SERVICE_TYPE.DUMMY:
      return new CryptoEncryptServiceDummy();
    case ENCRYPT_SERVICE_TYPE.FAKE_NONE:
      return new FakeNoneEncryptService();
    case ENCRYPT_SERVICE_TYPE.SPY_GENERIC:
      return new GenericEncryptServiceSpy();
    default:
      return new CryptoEncryptServiceDummy();
  }
};

const makeTokenService = (type: TOKEN_SERVICE_TYPE): any => {
  switch (type) {
    case TOKEN_SERVICE_TYPE.DUMMY:
      return new JWTTokenServiceDummy();
    case TOKEN_SERVICE_TYPE.STUB_NO_JWA_IN_SIGN:
      return new NoJsonWebAlgorithmInSignUpTokenServiceStub();
    case TOKEN_SERVICE_TYPE.SPY_CREATE_TOKEN:
      return new CreateTokenServiceSpy();
    case TOKEN_SERVICE_TYPE.MOCK_ONLY_FIRST_SIGN_CALL:
      return new OnlyFirstSignCallErrorTokenServiceMock();
    case TOKEN_SERVICE_TYPE.MOCK_ONLY_SECOND_SIGN_CALL:
      return new OnlySecondSignCallErrorTokenServiceMock();
    default:
      return new JWTTokenServiceDummy();
  }
};

const makeSut = (
  userRepository: USER_REPOSITORY_TYPE,
  hashService: HASH_SERVICE_TYPE,
  encryptService: ENCRYPT_SERVICE_TYPE,
  tokenService: TOKEN_SERVICE_TYPE,
): ISignInUseCase => {
  const userRepositoryDouble = makeUserRepository(userRepository);
  const cryptoHashServiceDouble = makeHashService(hashService);
  const cryptoEncryptServiceDouble = makeEncryptService(encryptService);
  const jwtTokenServiceDouble = makeTokenService(tokenService);

  const sut = new SignInUseCase(
    userRepositoryDouble,
    cryptoEncryptServiceDouble,
    cryptoHashServiceDouble,
    jwtTokenServiceDouble,
  );

  return sut;
};

describe('Sign-In Use Case', () => {
  let OLD_ENV: NodeJS.ProcessEnv;

  let sut: ISignInUseCase;

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
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.CODE_SALT = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_ACCESS_TOKEN_EXPIRES_IN env is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_REFRESH_TOKEN_EXPIRES_IN env is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_ACCESS_TOKEN_ID env is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.JWT_ACCESS_TOKEN_ID = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if JWT_REFRESH_TOKEN_ID env is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.JWT_REFRESH_TOKEN_ID = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if APP_SECRET env is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    process.env.APP_SECRET = '';

    const response = await sut.perform({} as any, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw invalid email error if email is undefiend', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email: any = undefined;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email is null', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email: any = null;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = '';

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email property has more than 320 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account property has more than 64 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(65)}@${'d'.repeat(126)}.${'d'.repeat(126)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain property has more than 255 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has an ending dot', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(63)}.@${'d'.repeat(127)}.${'d'.repeat(126)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has 0 characters - (too few characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `@${'d'.repeat(127)}.${'d'.repeat(127)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has 2 dots', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(31)}..${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email account has invalid character', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(32)} ${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain has 0 characters - (too few characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain does not have a dot separator', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain has 2 dot separators', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}..${'d'.repeat(126)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid email error if email domain part has more than 127 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;

    const request: AccountDto = {
      email,
      password: generateValidPassword(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid password error if password "value" property is undefined', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password: any = undefined;

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property is null', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password: any = null;

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = '';

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has less than 11 characters - (too few characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidShortPassword();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has more than 24 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidLongPassword();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has white space', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithWhiteSpace();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has less than 8 numeric digits', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithFewNumbers();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has no capital letters', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoCapitalLetters();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has no lower case letters', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoLowercaseLetters();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid password error if password "value" property has no special characters', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoSpecialChar();

    const request: AccountDto = {
      email: faker.internet.email(),
      password,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw forbidden error if email is not in the database', async () => {
    const request: AccountDto = {
      email: faker.internet.email(),
      password: generateValidPassword(),
    };

    const userRepositorySpy = makeUserRepository(
      USER_REPOSITORY_TYPE.SPY_USER_NOT_EXISTS,
    );
    const cryptoHashServiceDummy = makeHashService(HASH_SERVICE_TYPE.DUMMY);
    const cryptoEncryptServiceDummy = makeEncryptService(
      ENCRYPT_SERVICE_TYPE.DUMMY,
    );
    const jwtTokenServiceDummy = makeTokenService(TOKEN_SERVICE_TYPE.DUMMY);

    sut = new SignInUseCase(
      userRepositorySpy,
      cryptoEncryptServiceDummy,
      cryptoHashServiceDummy,
      jwtTokenServiceDummy,
    );

    const response = await sut.perform(request, '');

    expect(userRepositorySpy.countCreateCalls()).toBe(0);
    expect(userRepositorySpy.countFindUserByEmailCalls()).toBe(1);
    expect(userRepositorySpy.getParameters().findUserByEmail.email[0]).toBe(
      request.email,
    );
    expect(
      userRepositorySpy.getParameters().findUserByEmail.response[0],
    ).toBeUndefined();

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ForbiddenError());
  });

  it('should throw unauthorized error if request password differs from found user', async () => {
    const request: AccountDto = {
      email: faker.internet.email(),
      password: generateValidPassword(),
    };
    const host = faker.internet.ip();

    const userRepositorySpy = makeUserRepository(
      USER_REPOSITORY_TYPE.SPY_USER_ALREADY_EXISTS,
    );
    const cryptoHashServiceSpy = makeHashService(HASH_SERVICE_TYPE.SPY_GENERIC);
    const cryptoEncryptServiceSpy = makeEncryptService(
      ENCRYPT_SERVICE_TYPE.SPY_GENERIC,
    );
    const jwtTokenServiceMock = makeTokenService(
      TOKEN_SERVICE_TYPE.MOCK_ONLY_FIRST_SIGN_CALL,
    );

    sut = new SignInUseCase(
      userRepositorySpy,
      cryptoEncryptServiceSpy,
      cryptoHashServiceSpy,
      jwtTokenServiceMock,
    );

    const response = await sut.perform(request, host);

    expect(userRepositorySpy.getParameters().findUserByEmail.email[0]).toBe(
      request.email,
    );

    expect(cryptoEncryptServiceSpy.getParameters().decode.encrypt[0]).toBe(
      userRepositorySpy.getParameters().findUserByEmail.response[0].taxvat,
    );

    expect(cryptoHashServiceSpy.getParameters().encode.password[0]).toBe(
      userRepositorySpy.getParameters().findUserByEmail.response[0].password,
    );
    expect(cryptoHashServiceSpy.getParameters().encode.salt[0]).toBe(
      `${userRepositorySpy.getParameters().findUserByEmail.email[0]}${
        userRepositorySpy.getParameters().findUserByEmail.response[0].taxvat
      }`,
    );
    expect(cryptoHashServiceSpy.getParameters().encode.password[1]).toBe(
      `${cryptoHashServiceSpy.getParameters().encode.response[0]}`,
    );
    expect(cryptoHashServiceSpy.getParameters().encode.salt[1]).toBe(
      process.env.CODE_SALT,
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('should throw server error if jwt service that creates refresh token throws server error', async () => {
    const request: AccountDto = {
      email: faker.internet.email(),
      password: generateValidPassword(),
    };
    const host = faker.internet.ip();

    const userRepositorySpy = makeUserRepository(
      USER_REPOSITORY_TYPE.SPY_USER_ALREADY_EXISTS,
    );
    const cryptoHashServiceStub = makeHashService(
      HASH_SERVICE_TYPE.STUB_ONLY_CALL_SAME_PASSWORD,
    );
    const cryptoEncryptServiceSpy = makeEncryptService(
      ENCRYPT_SERVICE_TYPE.SPY_GENERIC,
    );
    const jwtTokenServiceMock = makeTokenService(
      TOKEN_SERVICE_TYPE.MOCK_ONLY_FIRST_SIGN_CALL,
    );

    sut = new SignInUseCase(
      userRepositorySpy,
      cryptoEncryptServiceSpy,
      cryptoHashServiceStub,
      jwtTokenServiceMock,
    );

    const response = await sut.perform(request, host);

    expect(userRepositorySpy.getParameters().findUserByEmail.email[0]).toBe(
      request.email,
    );

    expect(cryptoEncryptServiceSpy.getParameters().decode.encrypt[0]).toBe(
      userRepositorySpy.getParameters().findUserByEmail.response[0].taxvat,
    );

    expect(jwtTokenServiceMock.getParameters().sign.response[0].value).toEqual(
      new ServerError(),
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should throw server error if jwt service that creates access token throws server error', async () => {
    const request: AccountDto = {
      email: faker.internet.email(),
      password: generateValidPassword(),
    };
    const host = faker.internet.ip();

    const userRepositorySpy = makeUserRepository(
      USER_REPOSITORY_TYPE.SPY_USER_ALREADY_EXISTS,
    );
    const cryptoHashServiceStub = makeHashService(
      HASH_SERVICE_TYPE.STUB_ONLY_CALL_SAME_PASSWORD,
    );
    const cryptoEncryptServiceSpy = makeEncryptService(
      ENCRYPT_SERVICE_TYPE.SPY_GENERIC,
    );
    const jwtTokenServiceMock = makeTokenService(
      TOKEN_SERVICE_TYPE.MOCK_ONLY_SECOND_SIGN_CALL,
    );

    sut = new SignInUseCase(
      userRepositorySpy,
      cryptoEncryptServiceSpy,
      cryptoHashServiceStub,
      jwtTokenServiceMock,
    );

    const response = await sut.perform(request, host);

    expect(userRepositorySpy.getParameters().findUserByEmail.email[0]).toBe(
      request.email,
    );

    expect(cryptoEncryptServiceSpy.getParameters().decode.encrypt[0]).toBe(
      userRepositorySpy.getParameters().findUserByEmail.response[0].taxvat,
    );

    expect(jwtTokenServiceMock.getParameters().sign.expirationTime[0]).toBe(
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    );
    expect(jwtTokenServiceMock.getParameters().sign.options[0]).toEqual({
      subject: process.env.APP_SECRET,
      issuer: host,
      jwtId: process.env.JWT_REFRESH_TOKEN_ID,
    });

    expect(jwtTokenServiceMock.getParameters().sign.payload[0]).toEqual({
      id: userRepositorySpy.getParameters().findUserByEmail.response[0].id,
    });
    expect(jwtTokenServiceMock.getParameters().sign.response[0].isRight()).toBe(
      true,
    );
    expect(jwtTokenServiceMock.getParameters().sign.response[1].isLeft()).toBe(
      true,
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ServerError());
  });

  it('should create sign up account', async () => {
    const request: AccountDto = {
      email: faker.internet.email(),
      password: generateValidPassword(),
    };
    const host = faker.internet.ip();

    const userRepositorySpy = makeUserRepository(
      USER_REPOSITORY_TYPE.SPY_USER_ALREADY_EXISTS,
    );
    const cryptoHashServiceStub = makeHashService(
      HASH_SERVICE_TYPE.STUB_ONLY_CALL_SAME_PASSWORD,
    );
    const cryptoEncryptServiceSpy = makeEncryptService(
      ENCRYPT_SERVICE_TYPE.SPY_GENERIC,
    );
    const jwtTokenServiceSpy = makeTokenService(
      TOKEN_SERVICE_TYPE.SPY_CREATE_TOKEN,
    );

    sut = new SignInUseCase(
      userRepositorySpy,
      cryptoEncryptServiceSpy,
      cryptoHashServiceStub,
      jwtTokenServiceSpy,
    );

    const response = await sut.perform(request, host);

    expect(userRepositorySpy.getParameters().findUserByEmail.email[0]).toBe(
      request.email,
    );

    expect(cryptoEncryptServiceSpy.getParameters().decode.encrypt[0]).toBe(
      userRepositorySpy.getParameters().findUserByEmail.response[0].taxvat,
    );

    expect(jwtTokenServiceSpy.getParameters().sign.expirationTime[0]).toBe(
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    );
    expect(jwtTokenServiceSpy.getParameters().sign.expirationTime[1]).toBe(
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    );
    expect(jwtTokenServiceSpy.getParameters().sign.options[0]).toEqual({
      subject: process.env.APP_SECRET,
      issuer: host,
      jwtId: process.env.JWT_REFRESH_TOKEN_ID,
    });
    expect(jwtTokenServiceSpy.getParameters().sign.options[1]).toEqual({
      subject: userRepositorySpy.getParameters().findUserByEmail.response[0].id,
      issuer: host,
      jwtId: process.env.JWT_ACCESS_TOKEN_ID,
    });

    expect(jwtTokenServiceSpy.getParameters().sign.payload[0]).toEqual({
      id: userRepositorySpy.getParameters().findUserByEmail.response[0].id,
    });
    expect(jwtTokenServiceSpy.getParameters().sign.payload[1]).toEqual({
      email: cryptoEncryptServiceSpy.getParameters().encode.response[0],
    });

    expect(jwtTokenServiceSpy.getParameters().sign.response[0].isRight()).toBe(
      true,
    );
    expect(jwtTokenServiceSpy.getParameters().sign.response[1].isRight()).toBe(
      true,
    );

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual({
      accessToken: jwtTokenServiceSpy.getParameters().sign.response[0].value,
      refreshToken: jwtTokenServiceSpy.getParameters().sign.response[1].value,
    });
  });

  afterEach(() => {
    sut = {} as any;
  });

  afterAll(() => {
    /**
     * Restore old environment
     */
    process.env = {};
  });
});

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
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidTaxvatError,
  ServerError,
  UserAlreadyExistsError,
} from '../../../src/shared/errors';

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../src/use-cases';

/**
 * Fakes
 */
// eslint-disable-next-line sort-imports
import { FakeInMemoryUserRepository } from '../doubles/fakes';

/**
 * Stubs
 */
// eslint-disable-next-line sort-imports
import { UserAlreadyExistsRepositoryStub } from '../doubles/stubs';

/**
 * Dummies
 */
// eslint-disable-next-line sort-imports
import {
  CryptoEncryptServiceDummy,
  CryptoHashServiceDummy,
  JWTTokenServiceDummy,
  RabbitmqQueuePublishManagerDummy,
  UserRepositoryDummy,
} from '../doubles/dummies';

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

const generateInvalidFirstDigitTaxvat = (formatted?: boolean): string => {
  const cpfGenerated = cpf.generate();
  const secondValidationDigit = cpfGenerated.substring(
    cpfGenerated.length - 1,
    cpfGenerated.length,
  );
  const firstValidationDigit = cpfGenerated.substring(
    cpfGenerated.length - 2,
    cpfGenerated.length - 1,
  );

  const invalidFirstValidationDigit =
    +firstValidationDigit >= 9
      ? +firstValidationDigit - 1
      : +firstValidationDigit + 1;

  const invalidTaxvat =
    cpfGenerated.substring(0, cpfGenerated.length - 2) +
    invalidFirstValidationDigit +
    secondValidationDigit;

  return formatted
    ? `${invalidTaxvat.substring(0, 3)}.${invalidTaxvat.substring(
        3,
        6,
      )}.${invalidTaxvat.substring(6, 9)}-${invalidTaxvat.substring(9, 11)}`
    : invalidTaxvat;
};

const generateInvalidSecondDigitTaxvat = (formatted?: boolean): string => {
  const cpfGenerated = cpf.generate();
  const firstValidationDigit = cpfGenerated.substring(
    cpfGenerated.length - 2,
    cpfGenerated.length - 1,
  );
  const secondValidationDigit = cpfGenerated.substring(
    cpfGenerated.length - 1,
    cpfGenerated.length,
  );

  const invalidSecondValidationDigit =
    +secondValidationDigit >= 9
      ? +secondValidationDigit - 1
      : +secondValidationDigit + 1;

  const invalidTaxvat =
    cpfGenerated.substring(0, cpfGenerated.length - 2) +
    firstValidationDigit +
    invalidSecondValidationDigit;

  return formatted
    ? `${invalidTaxvat.substring(0, 3)}.${invalidTaxvat.substring(
        3,
        6,
      )}.${invalidTaxvat.substring(6, 9)}-${invalidTaxvat.substring(9, 11)}`
    : invalidTaxvat;
};

// eslint-disable-next-line no-shadow
enum SUT_TYPE {
  ALL_DUMMY = 'ALL_DUMMY',
}

// eslint-disable-next-line no-shadow
enum USER_REPOSITORY_TYPE {
  DUMMY = 'DUMMY',
  STUB_USER_ALREADY_EXISTS = 'STUB_USER_ALREADY_EXISTS',
  FAKE = 'FAKE',
  SPY = 'SPY',
}

// eslint-disable-next-line no-shadow
enum HASH_SERVICE_TYPE {
  DUMMY = 'DUMMY',
}

// eslint-disable-next-line no-shadow
enum ENCRYPT_SERVICE_TYPE {
  DUMMY = 'DUMMY',
}

// eslint-disable-next-line no-shadow
enum TOKEN_SERVICE_TYPE {
  DUMMY = 'DUMMY',
}

// eslint-disable-next-line no-shadow
enum QUEUE_PUBLISH_MANAGER_TYPE {
  DUMMY = 'DUMMY',
}

const makeUserRepository = (type: USER_REPOSITORY_TYPE): any => {
  switch (type) {
    case USER_REPOSITORY_TYPE.DUMMY:
      return new UserRepositoryDummy();
    case USER_REPOSITORY_TYPE.FAKE:
      return new FakeInMemoryUserRepository();
    case USER_REPOSITORY_TYPE.STUB_USER_ALREADY_EXISTS:
      return new UserAlreadyExistsRepositoryStub();
    default:
      return new UserRepositoryDummy();
  }
};

const makeHashService = (type: HASH_SERVICE_TYPE): any => {
  switch (type) {
    case HASH_SERVICE_TYPE.DUMMY:
      return new CryptoHashServiceDummy();
    default:
      return new CryptoHashServiceDummy();
  }
};

const makeEncryptService = (type: ENCRYPT_SERVICE_TYPE): any => {
  switch (type) {
    case ENCRYPT_SERVICE_TYPE.DUMMY:
      return new CryptoEncryptServiceDummy();
    default:
      return new CryptoEncryptServiceDummy();
  }
};

const makeTokenService = (type: TOKEN_SERVICE_TYPE): any => {
  switch (type) {
    case TOKEN_SERVICE_TYPE.DUMMY:
      return new JWTTokenServiceDummy();
    default:
      return new JWTTokenServiceDummy();
  }
};

const makeQueuePublishManager = (type: QUEUE_PUBLISH_MANAGER_TYPE): any => {
  switch (type) {
    case QUEUE_PUBLISH_MANAGER_TYPE.DUMMY:
      return new RabbitmqQueuePublishManagerDummy();
    default:
      return new RabbitmqQueuePublishManagerDummy();
  }
};

const makeSut = (
  userRepository: USER_REPOSITORY_TYPE,
  hashService: HASH_SERVICE_TYPE,
  encryptService: ENCRYPT_SERVICE_TYPE,
  tokenService: TOKEN_SERVICE_TYPE,
  queuePublishManager: QUEUE_PUBLISH_MANAGER_TYPE,
): ISignUpUseCase => {
  const userRepositoryDummy = makeUserRepository(userRepository);
  const cryptoHashServiceDummy = makeHashService(hashService);
  const cryptoEncryptServiceDummy = makeEncryptService(encryptService);
  const jwtTokenServiceDummy = makeTokenService(tokenService);
  const rabbitmqQueuePublishManagerDummy =
    makeQueuePublishManager(queuePublishManager);

  const sut = new SignUpUseCase(
    userRepositoryDummy,
    cryptoHashServiceDummy,
    cryptoEncryptServiceDummy,
    jwtTokenServiceDummy,
    rabbitmqQueuePublishManagerDummy,
  );

  return sut;
};

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
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email: any = undefined;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email: any = null;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = '';

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(65)}@${'d'.repeat(126)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(63)}.@${'d'.repeat(127)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `@${'d'.repeat(127)}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(31)}..${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(32)} ${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(127)}..${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const email = `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;

    const request: BasicUserDto = {
      email,
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should throw invalid name error if name is undefined', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name: any = undefined;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name is null', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name: any = null;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name = '';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name property has only white spaces', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name = ' ';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name property has only one character - (too few characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name = faker.lorem.word(1);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid name error if name property has more than 255 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const name = faker.lorem.word(256);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name,
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(name));
  });

  it('should throw invalid lastname error if lastname "value" property is undefined', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname: any = undefined;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid lastname error if lastname "value" property is null', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname: any = null;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid lastname error if lastname "value" property is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname = '';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid lastname error if lastname "value" property has only white spaces', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname = '  ';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid lastname error if lastname "value" property has only one character - (too few characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname = faker.lorem.word(1);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid lastname error if lastname "value" property has more than 255 characters - (too many characters)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const lastname = faker.lorem.word(256);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname,
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidLastnameError(lastname));
  });

  it('should throw invalid password error if password "value" property is undefined', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password: any = undefined;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password: any = null;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = '';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidShortPassword();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidLongPassword();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithWhiteSpace();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithFewNumbers();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoCapitalLetters();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoLowercaseLetters();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
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
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const password = generateInvalidPasswordWithNoSpecialChar();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password,
      taxvat: cpf.generate(),
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError(password));
  });

  it('should throw invalid taxvat error if taxvat "value" property is undefined', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat: any = undefined;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property is null', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat: any = null;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property is empty', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = '';

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property does not have correct length', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = `${faker.datatype.number({ min: 1, max: 10 })}`;

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property belongs to blacklist', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = generateBlacklistedTaxvat();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property first validation digit is invalid', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = generateInvalidFirstDigitTaxvat();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property first validation digit is invalid - (even formatted)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = generateInvalidFirstDigitTaxvat(true);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property second validation digit is invalid', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = generateInvalidSecondDigitTaxvat();

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" property second validation digit is invalid - (even formatted)', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = generateInvalidSecondDigitTaxvat(true);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw invalid taxvat error if taxvat "value" if property has letters', async () => {
    sut = makeSut(
      USER_REPOSITORY_TYPE.DUMMY,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const taxvat = faker.lorem.word(11);

    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat,
    };

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidTaxvatError(taxvat));
  });

  it('should throw user already exists error if user created is already in the database', async () => {
    const request: BasicUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: generateValidPassword(),
      taxvat: cpf.generate(),
    };

    sut = makeSut(
      USER_REPOSITORY_TYPE.STUB_USER_ALREADY_EXISTS,
      HASH_SERVICE_TYPE.DUMMY,
      ENCRYPT_SERVICE_TYPE.DUMMY,
      TOKEN_SERVICE_TYPE.DUMMY,
      QUEUE_PUBLISH_MANAGER_TYPE.DUMMY,
    );

    const response = await sut.perform(request, '');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new UserAlreadyExistsError());
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

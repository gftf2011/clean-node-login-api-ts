import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import {
  InvalidEmailError,
  InvalidPasswordError,
} from '../../../src/shared/errors';

/**
 * Entities
 */
import { AccountEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('Account Entity', () => {
  const generateValidEmail = (): string => {
    return faker.internet.email();
  };

  const generateLongInvalidEmail = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
  };

  const generateInvalidLongEmailAccount = (): string => {
    return `${'a'.repeat(65)}@${'d'.repeat(126)}.${'d'.repeat(126)}`;
  };

  const generateInvalidLongEmailDomain = (): string => {
    return `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
  };

  const generateInvalidEmailWithEndingDot = (): string => {
    return `${'a'.repeat(63)}.@${'d'.repeat(127)}.${'d'.repeat(126)}`;
  };

  const generateInvalidEmailWithNoAccount = (): string => {
    return `@${'d'.repeat(127)}.${'d'.repeat(127)}`;
  };

  const generateInvalidEmailAccountWithTwoDots = (): string => {
    return `${'a'.repeat(31)}..${'a'.repeat(31)}@${'d'.repeat(
      127,
    )}.${'d'.repeat(127)}`;
  };

  const generateInvalidEmailAccountWithInvalidChar = (): string => {
    return `${'a'.repeat(32)} ${'a'.repeat(31)}@${'d'.repeat(127)}.${'d'.repeat(
      127,
    )}`;
  };

  const generateInvalidEmailWithNoDomain = (): string => {
    return `${'a'.repeat(64)}@`;
  };

  const generateInvalidDomainEmailWithNoDotSeparator = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}`;
  };

  const generateInvalidDomainEmailWithTwoDotsSeparator = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(127)}..${'d'.repeat(126)}`;
  };

  const generateInvalidDomainEmailWithLocalPartTooLong = (): string => {
    return `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;
  };

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

  it('should not create account if "email" property is undefined', () => {
    const email: any = undefined;
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" property is null', () => {
    const email: any = null;
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" property is empty', () => {
    const email = '';
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" property has more than 320 characters - (too many characters)', () => {
    const email = generateLongInvalidEmail();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" account property has more than 64 characters - (too many characters)', () => {
    const email = generateInvalidLongEmailAccount();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" domain property has more than 255 characters - (too many characters)', () => {
    const email = generateInvalidLongEmailDomain();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" account has an ending dot', () => {
    const email = generateInvalidEmailWithEndingDot();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" account has 0 characters - (too few characters)', () => {
    const email = generateInvalidEmailWithNoAccount();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" account has 2 dots', () => {
    const email = generateInvalidEmailAccountWithTwoDots();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" account has invalid character', () => {
    const email = generateInvalidEmailAccountWithInvalidChar();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" domain has 0 characters - (too few characters)', () => {
    const email = generateInvalidEmailWithNoDomain();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" domain does not have a dot separator', () => {
    const email = generateInvalidDomainEmailWithNoDotSeparator();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" domain has 2 dot separators', () => {
    const email = generateInvalidDomainEmailWithTwoDotsSeparator();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "email" domain part has more than 127 characters - (too many characters)', () => {
    const email = generateInvalidDomainEmailWithLocalPartTooLong();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create account if "password" property is undefined', () => {
    const email = generateValidEmail();
    const password: any = undefined;
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" property is null', () => {
    const email = generateValidEmail();
    const password: any = null;
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" property is empty', () => {
    const email = generateValidEmail();
    const password = '';
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has less than 11 characters - (too few characters)', () => {
    const email = generateValidEmail();
    const password = generateInvalidShortPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has more than 24 characters - (too many characters)', () => {
    const email = generateValidEmail();
    const password = generateInvalidLongPassword();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" with white space', () => {
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithWhiteSpace();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has less than 8 numeric digits', () => {
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithFewNumbers();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has no capital letters', () => {
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithNoCapitalLetters();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has no lower case letters', () => {
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithNoLowercaseLetters();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create account if "password" has no special characters', () => {
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithNoSpecialChar();
    const accountOrError = AccountEntity.create(email, password);
    expect(accountOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should create account with correct parameters', () => {
    const email = generateValidEmail();
    const password = generateValidPassword();
    const accountOrError = AccountEntity.create(email, password);

    const account = (accountOrError.value as AccountEntity).getValue();

    expect(accountOrError.isRight()).toBeTruthy();

    expect(account.email).toBe(email);
    expect(account.password).toBe(password);
  });
});

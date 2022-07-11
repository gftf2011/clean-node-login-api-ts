/**
 * Driver
 */
import { cpf } from 'cpf-cnpj-validator';
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidTaxvatError,
} from '../../../src/shared/errors';

/**
 * Entities
 */
import { UserEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('User Entity', () => {
  const generateValidName = (): string => {
    return faker.lorem.word(2);
  };

  const generateValidLastname = (): string => {
    return faker.lorem.word(2);
  };

  const generateValidTaxvat = (formatted?: boolean): string => {
    return cpf.generate(formatted);
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

  it('should not create user if "name" property is undefined', () => {
    const name: string = undefined;
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property is null', () => {
    const name: string = null;
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property is empty', () => {
    const name = '';
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has only white spaces', () => {
    const name = ' ';
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has only one character - (too few characters)', () => {
    const name = faker.lorem.word(1);
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "name" property has more than 255 characters - (too many characters)', () => {
    const name = faker.lorem.word(256);
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create user if "lastname" property is undefined', () => {
    const name = generateValidName();
    const lastname: string = undefined;
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property is null', () => {
    const name = generateValidName();
    const lastname: string = null;
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property is empty', () => {
    const name = generateValidName();
    const lastname = '';
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property has only white spaces', () => {
    const name = generateValidName();
    const lastname = ' ';
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property has only one character - (too few characters)', () => {
    const name = generateValidName();
    const lastname = faker.lorem.word(1);
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "lastname" property has more than 255 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = faker.lorem.word(256);
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create user if "taxvat" property is undefined', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat: string = undefined;
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" property is null', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat: string = null;
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" property is empty', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = '';
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" does not have correct length', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = `${faker.datatype.number({ min: 1, max: 10 })}`;
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" belongs to blacklist', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateBlacklistedTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" first validation digit is invalid', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateInvalidFirstDigitTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" first validation digit is invalid - (even formatted)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateInvalidFirstDigitTaxvat(true);
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" second validation digit is invalid', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateInvalidSecondDigitTaxvat();
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" second validation digit is invalid - (even formatted)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateInvalidSecondDigitTaxvat(true);
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "taxvat" if property has letters', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = faker.lorem.word(11);
    const email = generateValidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidTaxvatError(taxvat)));
  });

  it('should not create user if "email" property is undefined', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email: string = undefined;
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" property is null', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email: string = null;
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" property is empty', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = '';
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" property has more than 320 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateLongInvalidEmail();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" account property has more than 64 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidLongEmailAccount();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" domain property has more than 255 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidLongEmailDomain();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" account has an ending dot', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidEmailWithEndingDot();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" account has 0 characters - (too few characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidEmailWithNoAccount();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" account has 2 dots', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidEmailAccountWithTwoDots();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" account has invalid character', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidEmailAccountWithInvalidChar();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" domain has 0 characters - (too few characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidEmailWithNoDomain();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" domain does not have a dot separator', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidDomainEmailWithNoDotSeparator();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" domain has 2 dot separators', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidDomainEmailWithTwoDotsSeparator();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "email" domain part has more than 127 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateInvalidDomainEmailWithLocalPartTooLong();
    const password = generateValidPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidEmailError(email)));
  });

  it('should not create user if "password" property is undefined', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password: string = undefined;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" property is null', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password: string = null;
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" property is empty', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = '';
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" has less than 11 characters - (too few characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateInvalidShortPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" has more than 24 characters - (too many characters)', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateInvalidLongPassword();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" with white space', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithWhiteSpace();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" has less than 8 numeric digits', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithFewNumbers();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create user if "password" has no capital letters', () => {
    const name = generateValidName();
    const lastname = generateValidLastname();
    const taxvat = generateValidTaxvat();
    const email = generateValidEmail();
    const password = generateInvalidPasswordWithNoCapitalLetters();
    const userOrError = UserEntity.create(
      name,
      lastname,
      taxvat,
      email,
      password,
    );
    expect(userOrError).toEqual(left(new InvalidPasswordError(password)));
  });
});

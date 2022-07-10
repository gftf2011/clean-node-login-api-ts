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
  InvalidLastnameError,
  InvalidNameError,
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
    const name = '    ';
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
    const lastname = '    ';
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
});

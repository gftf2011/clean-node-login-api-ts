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

  const generateValidTaxvat = (): string => {
    return cpf.generate();
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
    return `${faker.datatype.number({ min: 8, max: 8 })}${faker.lorem
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
});

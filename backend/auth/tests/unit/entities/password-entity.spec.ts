/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { InvalidPasswordError } from '../../../src/shared/errors';

/**
 * Entities
 */
import { PasswordEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('Password Entity', () => {
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

  it('should not create password if "value" property is undefined', () => {
    const password: any = undefined;
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" property is null', () => {
    const password: any = null;
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" property is empty', () => {
    const password = '';
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has less than 11 characters - (too few characters)', () => {
    const password = generateInvalidShortPassword();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has more than 24 characters - (too many characters)', () => {
    const password = generateInvalidLongPassword();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has white space', () => {
    const password = generateInvalidPasswordWithWhiteSpace();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has less than 8 numeric digits', () => {
    const password = generateInvalidPasswordWithFewNumbers();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has no capital letters', () => {
    const password = generateInvalidPasswordWithNoCapitalLetters();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has no lower case letters', () => {
    const password = generateInvalidPasswordWithNoLowercaseLetters();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should not create password if "value" has no special characters', () => {
    const password = generateInvalidPasswordWithNoSpecialChar();
    const passwordOrError = PasswordEntity.create(password);
    expect(passwordOrError).toEqual(left(new InvalidPasswordError(password)));
  });

  it('should create password with correct parameters', () => {
    const password = generateValidPassword();
    const passwordOrError = PasswordEntity.create(password);

    const passwordEntity = passwordOrError.value as PasswordEntity;

    expect(passwordEntity.getValue()).toBe(password);
  });
});

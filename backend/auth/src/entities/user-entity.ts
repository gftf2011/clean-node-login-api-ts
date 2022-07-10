/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidTaxvatError,
} from '../shared/errors';
import {
  getEmailAccount,
  getEmailAddress,
  getEmailDomainsFromAddress,
  getOnlyCapitalLettersFromValue,
  getOnlyLowerCaseLettersFromValue,
  getOnlyNumbersFromValue,
  getOnlySpecialCharactersFromValue,
  hasPasswordAnyEmptySpace,
  normalizeValueToPascalCase,
  removeExtremitiesWhiteSpaces,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
} from '../shared/utils';

export class UserEntity {
  private readonly name: string;

  private readonly lastname: string;

  private readonly taxvat: string;

  private readonly email: string;

  private readonly password: string;

  private constructor(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string,
  ) {
    this.name = name;
    this.lastname = lastname;
    this.taxvat = taxvat;
    this.email = email;
    this.password = password;
    Object.freeze(this);
  }

  getName(): string {
    return this.name;
  }

  getLastname(): string {
    return this.lastname;
  }

  getTaxvat(): string {
    return this.taxvat;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  /**
   * @desc Utility method to tell if taxvat has correct length
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if taxvat has correct length
   */
  private static hasTaxvatCorrectLength(taxvat: string): boolean {
    const TAXVAT_CORRECT_LENGTH = 11;

    return taxvat.length === TAXVAT_CORRECT_LENGTH;
  }

  /**
   * @desc Utility method to tell if taxvat has correct extended length
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if taxvat has correct extended length
   */
  private static hasTaxvatCorrectExtendedLength(taxvat: string): boolean {
    const TAXVAT_EXTENDED_LENGTH = 14;

    return taxvat.length === TAXVAT_EXTENDED_LENGTH;
  }

  /**
   * @desc Utility method to tell if taxvat with correct length has only digits
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if taxvat has only digits
   */
  private static hasTaxvatOnlyDigits(taxvat: string): boolean {
    const TAXVAT_ONLY_NUMBERS_REGEX =
      /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g;

    return TAXVAT_ONLY_NUMBERS_REGEX.test(taxvat);
  }

  /**
   * @desc Utility method to tell if taxvat correctly formatted
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if taxvat is correctly formatted
   */
  private static isTaxvatFormattedCorrectly(taxvat: string): boolean {
    const FORMATTED_TAXVAT = /^([0-9]{3})\.([0-9]{3})\.([0-9]{3})-([0-9]{2})$/g;

    return FORMATTED_TAXVAT.test(taxvat);
  }

  /**
   * @desc Utility method to tell if email is valid
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - user email
   * @returns {boolean} return if email is valid
   */
  private static isEmailValid(email: string): boolean {
    /**
     * @desc Email regex
     * @author Esteban Küber
     * @link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
     */
    const VALID_EMAIL_REGEX =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    return VALID_EMAIL_REGEX.test(email);
  }

  /**
   * @desc Utility method to tell if taxvat is in blacklist
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if taxvat is in blacklist
   */
  private static isTaxvatInBlacklist(taxvat: string): boolean {
    /**
     * Taxvat list that pass through the validation algoritm
     * but are not considered valid
     */
    const TAXVAT_BLACKLIST: string[] = [
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

    return TAXVAT_BLACKLIST.some((value: string) => value === taxvat);
  }

  /**
   * @desc Utility method to clean formatted taxvat
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {string} return unformatted taxvat
   */
  private static clearTaxvat(taxvat: string): string {
    return taxvat.replace(/[\\.-]*/g, '').trim();
  }

  /**
   * @desc Utility method to know if first validation digit from taxvat is valid
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if first validation digit is valid
   */
  private static isTaxvatFirstDigitValid(taxvat: string): boolean {
    const TAXVAT_ONLY_NUMBERS_REGEX =
      /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g;

    const groups = TAXVAT_ONLY_NUMBERS_REGEX.exec(taxvat);

    const value1 = groups[1];
    const value2 = groups[2];
    const value3 = groups[3];
    const validationDigits = groups[4];

    const num1: number = 10 * +String(value1).charAt(0);
    const num2: number = 9 * +String(value1).charAt(1);
    const num3: number = 8 * +String(value1).charAt(2);

    const num4: number = 7 * +String(value2).charAt(0);
    const num5: number = 6 * +String(value2).charAt(1);
    const num6: number = 5 * +String(value2).charAt(2);

    const num7: number = 4 * +String(value3).charAt(0);
    const num8: number = 3 * +String(value3).charAt(1);
    const num9: number = 2 * +String(value3).charAt(2);

    let result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9) * 10) %
      11;

    if (result === 10) {
      result = 0;
    }

    return +String(validationDigits).charAt(0) === result;
  }

  /**
   * @desc Utility method to know if second validation digit from taxvat is valid
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {boolean} return if second validation digit is valid
   */
  private static isTaxvatSecondDigitValid(taxvat: string): boolean {
    const TAXVAT_ONLY_NUMBERS_REGEX =
      /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g;

    const groups = TAXVAT_ONLY_NUMBERS_REGEX.exec(taxvat);

    const value1 = groups[1];
    const value2 = groups[2];
    const value3 = groups[3];
    const validationDigits = groups[4];

    const num1: number = 11 * +String(value1).charAt(0);
    const num2: number = 10 * +String(value1).charAt(1);
    const num3: number = 9 * +String(value1).charAt(2);

    const num4: number = 8 * +String(value2).charAt(0);
    const num5: number = 7 * +String(value2).charAt(1);
    const num6: number = 6 * +String(value2).charAt(2);

    const num7: number = 5 * +String(value3).charAt(0);
    const num8: number = 4 * +String(value3).charAt(1);
    const num9: number = 3 * +String(value3).charAt(2);

    const num10: number = 2 * +String(validationDigits).charAt(0);

    let result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10) *
        10) %
      11;

    if (result === 10) {
      result = 0;
    }

    return +String(validationDigits).charAt(1) === result;
  }

  private static validateName(name: string): boolean {
    if (!name) {
      return false;
    }
    const cleanName = removeMultipleWhiteSpacesToSingleWhiteSpace(
      removeExtremitiesWhiteSpaces(name),
    );
    if (cleanName.length < 2 || cleanName.length > 255) {
      return false;
    }
    return true;
  }

  private static validateLastname(lastname: string): boolean {
    if (!lastname) {
      return false;
    }
    const cleanLastname = removeMultipleWhiteSpacesToSingleWhiteSpace(
      removeExtremitiesWhiteSpaces(lastname),
    );
    if (cleanLastname.length < 2 || cleanLastname.length > 255) {
      return false;
    }
    return true;
  }

  private static validateTaxvat(taxvat: string): boolean {
    if (!taxvat) {
      return false;
    }

    let clearedTaxvat = taxvat;

    if (
      UserEntity.hasTaxvatCorrectExtendedLength(clearedTaxvat) &&
      UserEntity.isTaxvatFormattedCorrectly(clearedTaxvat)
    ) {
      clearedTaxvat = UserEntity.clearTaxvat(clearedTaxvat);
    }

    if (!UserEntity.hasTaxvatCorrectLength(clearedTaxvat)) {
      return false;
    }

    if (UserEntity.isTaxvatInBlacklist(clearedTaxvat)) {
      return false;
    }

    if (!UserEntity.hasTaxvatOnlyDigits(clearedTaxvat)) {
      return false;
    }

    if (
      !UserEntity.isTaxvatFirstDigitValid(clearedTaxvat) &&
      !UserEntity.isTaxvatSecondDigitValid(clearedTaxvat)
    ) {
      return false;
    }

    return true;
  }

  private static validateEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    if (email.length > 255) {
      return false;
    }
    if (!UserEntity.isEmailValid(email)) {
      return false;
    }
    const account = getEmailAccount(email);
    const address = getEmailAddress(email);
    if (account.length > 64) {
      return false;
    }
    if (getEmailDomainsFromAddress(address).some(part => part.length > 63)) {
      return false;
    }
    return true;
  }

  private static validatePassword(password: string): boolean {
    const pass: string = password;
    if (!pass || pass.length < 11) {
      return false;
    }
    if (hasPasswordAnyEmptySpace(pass)) {
      return false;
    }
    const onlyNumbers: string = getOnlyNumbersFromValue(pass);
    if (onlyNumbers.length < 8) {
      return false;
    }
    const onlyCapitalLetters: string = getOnlyCapitalLettersFromValue(pass);
    if (onlyCapitalLetters.length < 1) {
      return false;
    }
    const onlyLowerCaseLetters: string = getOnlyLowerCaseLettersFromValue(pass);
    if (onlyLowerCaseLetters.length < 1) {
      return false;
    }
    const onlySpecialCharacters: string =
      getOnlySpecialCharactersFromValue(pass);
    if (onlySpecialCharacters.length < 1) {
      return false;
    }
    return true;
  }

  private static validate(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string,
  ): Either<Error, true> {
    if (!UserEntity.validateName(name)) {
      return left(new InvalidNameError(name));
    }
    if (!UserEntity.validateLastname(lastname)) {
      return left(new InvalidLastnameError(lastname));
    }
    if (!UserEntity.validateTaxvat(taxvat)) {
      return left(new InvalidTaxvatError(taxvat));
    }
    if (!UserEntity.validateEmail(email)) {
      return left(new InvalidEmailError(email));
    }
    if (!UserEntity.validatePassword(password)) {
      return left(new InvalidPasswordError(password));
    }
    return right(true);
  }

  static create(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string,
  ): Either<Error, UserEntity> {
    const either = UserEntity.validate(name, lastname, taxvat, email, password);
    if (either.isRight()) {
      return right(
        new UserEntity(
          normalizeValueToPascalCase(
            removeMultipleWhiteSpacesToSingleWhiteSpace(
              removeExtremitiesWhiteSpaces(name),
            ),
          ),
          normalizeValueToPascalCase(
            removeMultipleWhiteSpacesToSingleWhiteSpace(
              removeExtremitiesWhiteSpaces(lastname),
            ),
          ),
          UserEntity.clearTaxvat(taxvat),
          email,
          password,
        ),
      );
    }
    return left(either.value);
  }
}

/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  getOnlyCapitalLettersFromValue,
  getOnlyLowerCaseLettersFromValue,
  getOnlyNumbersFromValue,
} from '../shared/utils';

/**
 * Entities
 */
import { IEntity } from './contracts';

/**
 * Shared
 */
import { InvalidPasswordError } from '../shared/errors';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Password business domain
 */
export class PasswordEntity implements IEntity<string> {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
    Object.freeze(this);
  }

  /**
   * @desc Getter to return password value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get password
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * @desc Utility method to know if password has white spaces
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} password - user password
   * @returns {boolean} return if password has white spaces
   */
  private static hasPasswordAnyEmptySpace(password: string): boolean {
    const PASSWORD_HAS_ANY_SPACE_REGEX = /([ ]+)/g;

    return PASSWORD_HAS_ANY_SPACE_REGEX.test(password);
  }

  /**
   * @desc Utility method to get password special characters
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} password - user password
   * @returns {string} return the password special characters
   */
  private static getOnlySpecialCharactersFromPassword(
    password: string,
  ): string {
    const NOT_SPECIAL_CHARACTER_REGEX = /([^!@#$%&?]*)/g;

    const EMPTY_CHARACTER_SEPARATOR = '';

    return password.replace(
      NOT_SPECIAL_CHARACTER_REGEX,
      EMPTY_CHARACTER_SEPARATOR,
    );
  }

  /**
   * @desc Validate if password is valid according with business rule definition
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} - password
   * @returns {boolean} indicates if password is valid
   */
  private static validate(password: string): boolean {
    const pass: string = password;
    if (!pass || pass.length < 11 || pass.length > 24) {
      return false;
    }
    if (this.hasPasswordAnyEmptySpace(pass)) {
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
      this.getOnlySpecialCharactersFromPassword(pass);
    if (onlySpecialCharacters.length < 1) {
      return false;
    }
    return true;
  }

  /**
   * @desc responsible function to create a Password
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} password - password
   * @returns {Either<Error, PasswordEntity>} returns the created Password entity or an Error
   */
  public static create(password: string): Either<Error, PasswordEntity> {
    if (!this.validate(password)) {
      return left(new InvalidPasswordError(password));
    }
    return right(new PasswordEntity(password));
  }
}

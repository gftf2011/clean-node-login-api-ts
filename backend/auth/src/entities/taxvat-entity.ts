/**
 * Shared
 */
import { Either, left, right } from '../shared';

/**
 * Entities
 */
import { IEntity } from './contracts';

/**
 * Shared
 */
import { InvalidTaxvatError } from '../shared/errors';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Taxvat business domain
 */
export class TaxvatEntity implements IEntity {
  private readonly value: string;

  private constructor(taxvat: string) {
    this.value = taxvat;
    Object.freeze(this);
  }

  /**
   * @desc Getter to return taxvat value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get unformatted taxvat
   * @example
   * returns 11111111111
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * @desc Method returns taxvat in formatted way
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get formatted taxvat
   * @example
   * returns 111.111.111-11
   */
  public getFormattedValue(): string {
    return TaxvatEntity.formatTaxvat(this.value);
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
   * @desc Utility method to format taxvat
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - user taxvat
   * @returns {string} return formatted taxvat
   */
  private static formatTaxvat(taxvat: string): string {
    const cleanTaxvat = this.clearTaxvat(taxvat);
    return cleanTaxvat.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
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

    const result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9) * 10) %
      11;

    let resultString = String(result);
    resultString = resultString.charAt(resultString.length - 1);

    return +String(validationDigits).charAt(0) === +resultString;
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

    const result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10) *
        10) %
      11;

    let resultString = String(result);
    resultString = resultString.charAt(resultString.length - 1);

    return +String(validationDigits).charAt(1) === +resultString;
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
   * @desc Validate if taxvat is valid according with business rule definition
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} - taxvat
   * @returns {boolean} indicates if taxvat is valid OR not
   */
  private static validate(taxvat: string): boolean {
    if (!taxvat) {
      return false;
    }

    const clearedTaxvat = this.clearTaxvat(taxvat);

    if (!this.hasTaxvatCorrectLength(clearedTaxvat)) {
      return false;
    }

    if (!this.hasTaxvatOnlyDigits(clearedTaxvat)) {
      return false;
    }

    if (
      !this.isTaxvatFirstDigitValid(clearedTaxvat) ||
      !this.isTaxvatSecondDigitValid(clearedTaxvat)
    ) {
      return false;
    }

    if (this.isTaxvatInBlacklist(clearedTaxvat)) {
      return false;
    }

    return true;
  }

  /**
   * @desc responsible function to create a Taxvat
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} taxvat - taxvat
   * @returns {Either<Error, TaxvatEntity>} returns the created Taxvat entity or an Error
   */
  public static create(taxvat: string): Either<Error, TaxvatEntity> {
    if (!this.validate(taxvat)) {
      return left(new InvalidTaxvatError(taxvat));
    }
    return right(new TaxvatEntity(this.clearTaxvat(taxvat)));
  }
}

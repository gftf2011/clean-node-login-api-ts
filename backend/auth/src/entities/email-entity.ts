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
import { InvalidEmailError } from '../shared/errors';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Email business domain
 */
export class EmailEntity implements IEntity<string> {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  /**
   * @desc Getter to return email value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get email
   * @example
   * returns 'test@gmail.com'
   */
  public getValue(): string {
    return this.value;
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
   * @desc Utility method to grab email account
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - user email
   * @returns {string} return user email account
   */
  private static getEmailAccount(email: string): string {
    const EMAIL_ADDRESS_SEPARATOR = '@';

    return email.split(EMAIL_ADDRESS_SEPARATOR)[0];
  }

  /**
   * @desc Utility method to grab email address
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - user email
   * @returns {string} return user email address
   */
  private static getEmailAddress = (email: string): string => {
    const EMAIL_ADDRESS_SEPARATOR = '@';

    return email.split(EMAIL_ADDRESS_SEPARATOR)[1];
  };

  /**
   * @desc Utility method to grab email address separeted by parts
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - user email
   * @returns {string[]} return user email address parts
   */
  private static getEmailDomainsFromAddress(address: string): string[] {
    const EMAIL_DOMAIN_SEPARATOR = '.';

    return address.split(EMAIL_DOMAIN_SEPARATOR);
  }

  /**
   * @desc Validate if email is valid according with business rule definition
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} - email
   * @returns {boolean} indicates if email is valid
   */
  private static validate(email: string): boolean {
    if (!email) {
      return false;
    }
    if (email.length > 320) {
      return false;
    }
    if (!this.isEmailValid(email)) {
      return false;
    }
    const account = this.getEmailAccount(email);
    const address = this.getEmailAddress(email);
    if (account.length > 64) {
      return false;
    }
    if (address.length > 255) {
      return false;
    }
    const addresses = this.getEmailDomainsFromAddress(address);
    if (addresses.some(part => part.length > 127)) {
      return false;
    }
    return true;
  }

  /**
   * @desc responsible function to create an Email
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - email
   * @returns {Either<Error, EmailEntity>} returns the created Email entity or an Error
   */
  public static create(email: string): Either<Error, EmailEntity> {
    if (!this.validate(email)) {
      return left(new InvalidEmailError(email));
    }
    return right(new EmailEntity(email));
  }
}

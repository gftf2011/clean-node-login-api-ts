/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  normalizeValueToLowerCase,
  removeExtremitiesWhiteSpaces,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
} from '../shared/utils';

/**
 * Entities
 */
import { IEntity } from './contracts';

/**
 * Shared
 */
import { InvalidLastnameError } from '../shared/errors';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Lastname business domain
 */
export class LastnameEntity implements IEntity<string> {
  private readonly value: string;

  private constructor(lastname: string) {
    this.value = lastname;
    Object.freeze(this);
  }

  /**
   * @desc Getter to return lastname value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get lastname
   * @example
   * returns 'ferrari'
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * @desc Validate if lastname is valid according with business rule definition
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} - lastname
   * @returns {boolean} indicates if lastname is valid
   */
  private static validate(lastname: string): boolean {
    if (!lastname) {
      return false;
    }
    const cleanName = removeMultipleWhiteSpacesToSingleWhiteSpace(
      removeExtremitiesWhiteSpaces(lastname),
    );
    if (cleanName.length < 2 || cleanName.length > 255) {
      return false;
    }
    return true;
  }

  /**
   * @desc responsible function to create a Lastname
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} lastname - lastname
   * @returns {Either<Error, LastnameEntity>} returns the created Lastname entity or an Error
   */
  public static create(lastname: string): Either<Error, LastnameEntity> {
    if (!this.validate(lastname)) {
      return left(new InvalidLastnameError(lastname));
    }
    return right(
      new LastnameEntity(
        removeMultipleWhiteSpacesToSingleWhiteSpace(
          removeExtremitiesWhiteSpaces(normalizeValueToLowerCase(lastname)),
        ),
      ),
    );
  }
}

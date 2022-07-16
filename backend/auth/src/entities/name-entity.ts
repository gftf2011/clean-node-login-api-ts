/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  normalizeValueToLowerCase,
  normalizeValueToPascalCase,
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
import { InvalidNameError } from '../shared/errors';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Name business domain
 */
export class NameEntity implements IEntity {
  private readonly value: string;

  private constructor(name: string) {
    this.value = name;
    Object.freeze(this);
  }

  /**
   * @desc Getter to return name value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get name
   * @example
   * returns 'gabriel'
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * @desc Getter to return name value in Pascal case
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get name in Pascal case
   * @example
   * returns 'Gabriel'
   */
  public getValueInPascalCase(): string {
    return normalizeValueToPascalCase(this.value);
  }

  /**
   * @desc Validate if name is valid according with business rule definition
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} - name
   * @returns {boolean} indicates if name is valid
   */
  private static validate(name: string): boolean {
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

  /**
   * @desc responsible function to create a Name
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} name - name
   * @returns {Either<Error, NameEntity>} returns the created Name entity or an Error
   */
  public static create(name: string): Either<Error, NameEntity> {
    if (!this.validate(name)) {
      return left(new InvalidNameError(name));
    }
    return right(
      new NameEntity(
        removeMultipleWhiteSpacesToSingleWhiteSpace(
          removeExtremitiesWhiteSpaces(normalizeValueToLowerCase(name)),
        ),
      ),
    );
  }
}

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
import { InvalidLastnameError } from '../shared/errors';

export class LastnameEntity implements IEntity {
  private readonly value: string;

  private constructor(lastname: string) {
    this.value = lastname;
    Object.freeze(this);
  }

  public getValue(): string {
    return this.value;
  }

  public getValueInPascalCase(): string {
    return normalizeValueToPascalCase(this.value);
  }

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

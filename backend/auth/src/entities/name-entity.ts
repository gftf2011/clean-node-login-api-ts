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

export class NameEntity implements IEntity {
  private readonly value: string;

  private constructor(name: string) {
    this.value = name;
    Object.freeze(this);
  }

  public getValue(): string {
    return this.value;
  }

  public getValueInPascalCase(): string {
    return normalizeValueToPascalCase(this.value);
  }

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

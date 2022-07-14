/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  normalizeValueToPascalCase,
  removeExtremitiesWhiteSpaces,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
} from '../shared/utils';
import { InvalidNameError } from '../shared/errors';

export class NameEntity {
  private readonly value: string;

  private constructor(name: string) {
    this.value = name;
    Object.freeze(this);
  }

  public getName(): string {
    return this.value;
  }

  public getNameInPascalCase(): string {
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
    return right(new NameEntity(name));
  }
}
/**
 * Shared
 */
import { Either, left, right } from '../shared';
import {
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
} from '../shared/errors';
import {
  getEmailAccount,
  getEmailAddress,
  getEmailDomainsFromAddress,
  isEmailValid,
  normalizeValueToPascalCase,
  removeExtremitiesWhiteSpaces,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
} from '../shared/utils';

export class UserEntity {
  private readonly name: string;

  private readonly lastname: string;

  private readonly email: string;

  private constructor(name: string, lastname: string, email: string) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    Object.freeze(this);
  }

  getName(): string {
    return this.name;
  }

  getLastname(): string {
    return this.lastname;
  }

  getEmail(): string {
    return this.email;
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

  private static validateEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    if (email.length > 255) {
      return false;
    }
    if (!isEmailValid(email)) {
      return false;
    }
    const account = getEmailAccount(email);
    const address = getEmailAddress(email);
    if (account.length > 64) {
      return false;
    }
    if (
      getEmailDomainsFromAddress(address).some(function (part) {
        return part.length > 63;
      })
    ) {
      return false;
    }
    return true;
  }

  private static validate(
    name: string,
    lastname: string,
    email: string,
  ): Either<Error, true> {
    if (!UserEntity.validateName(name)) {
      return left(new InvalidNameError(name));
    }
    if (!UserEntity.validateLastname(lastname)) {
      return left(new InvalidLastnameError(lastname));
    }
    if (!UserEntity.validateEmail(email)) {
      return left(new InvalidEmailError(email));
    }
    return right(true);
  }

  static create(
    name: string,
    lastname: string,
    email: string,
  ): Either<Error, UserEntity> {
    const either = UserEntity.validate(name, lastname, email);
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
          email,
        ),
      );
    }
    return left(either.value);
  }
}

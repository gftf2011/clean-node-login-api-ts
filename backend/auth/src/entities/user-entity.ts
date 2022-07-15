/**
 * Shared
 */
import { Either, left, right } from '../shared';

/**
 * Entities
 */
import { EmailEntity } from './email-entity';
import { EntityFactory } from './helpers/factory-methods';
import { LastnameEntity } from './lastname-entity';
import { NameEntity } from './name-entity';
import { PasswordEntity } from './password-entity';
import { TaxvatEntity } from './taxvat-entity';

export class UserEntity {
  private readonly name: NameEntity;

  private readonly lastname: LastnameEntity;

  private readonly taxvat: TaxvatEntity;

  private readonly email: EmailEntity;

  private readonly password: PasswordEntity;

  private constructor(
    name: NameEntity,
    lastname: LastnameEntity,
    taxvat: TaxvatEntity,
    email: EmailEntity,
    password: PasswordEntity,
  ) {
    this.name = name;
    this.lastname = lastname;
    this.taxvat = taxvat;
    this.email = email;
    this.password = password;
    Object.freeze(this);
  }

  getName(): string {
    return this.name.getValue();
  }

  getLastname(): string {
    return this.lastname.getValue();
  }

  getTaxvat(): string {
    return this.taxvat.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getPassword(): string {
    return this.password.getValue();
  }

  static create(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string,
  ): Either<Error, UserEntity> {
    const nameOrError = EntityFactory.create(NameEntity.name, name);
    const lastnameOrError = EntityFactory.create(LastnameEntity.name, lastname);
    const taxvatOrError = EntityFactory.create(TaxvatEntity.name, taxvat);
    const emailOrError = EntityFactory.create(EmailEntity.name, email);
    const passwordOrError = EntityFactory.create(PasswordEntity.name, password);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (lastnameOrError.isLeft()) {
      return left(lastnameOrError.value);
    }

    if (taxvatOrError.isLeft()) {
      return left(taxvatOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    return right(
      new UserEntity(
        nameOrError.value as NameEntity,
        lastnameOrError.value as LastnameEntity,
        taxvatOrError.value as TaxvatEntity,
        emailOrError.value as EmailEntity,
        passwordOrError.value as PasswordEntity,
      ),
    );
  }
}

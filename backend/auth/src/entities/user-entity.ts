/**
 * Shared
 */
import { Either, left, right } from '../shared';
import { EmailEntity } from './email-entity';
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
    return this.name.getName();
  }

  getLastname(): string {
    return this.lastname.getLastname();
  }

  getTaxvat(): string {
    return this.taxvat.getTaxvat();
  }

  getEmail(): string {
    return this.email.getEmail();
  }

  getPassword(): string {
    return this.password.getPassword();
  }

  static create(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string,
  ): Either<Error, UserEntity> {
    const nameOrError = NameEntity.create(name);
    const lastnameOrError = LastnameEntity.create(lastname);
    const taxvatOrError = TaxvatEntity.create(taxvat);
    const emailOrError = EmailEntity.create(email);
    const passwordOrError = PasswordEntity.create(password);

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
        nameOrError.value,
        lastnameOrError.value,
        taxvatOrError.value,
        emailOrError.value,
        passwordOrError.value,
      ),
    );
  }
}

/**
 * Shared
 */
import { Either, left, right } from '../shared';

/**
 * Entities
 */
import { EmailEntity } from './email-entity';
import { EntityFactory } from './helpers/factory-methods';
import { IEntity } from './contracts';
import { LastnameEntity } from './lastname-entity';
import { NameEntity } from './name-entity';
import { PasswordEntity } from './password-entity';
import { TaxvatEntity } from './taxvat-entity';

interface User {
  name: string;
  lastname: string;
  taxvat: string;
  email: string;
  password: string;
}

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc User business domain
 */
export class UserEntity implements IEntity<User> {
  private readonly value: User;

  private constructor(
    name: NameEntity,
    lastname: LastnameEntity,
    taxvat: TaxvatEntity,
    email: EmailEntity,
    password: PasswordEntity,
  ) {
    this.value = {
      email: email.getValue(),
      lastname: lastname.getValue(),
      name: name.getValue(),
      password: password.getValue(),
      taxvat: taxvat.getValue(),
    };
    Object.freeze(this);
  }

  /**
   * @desc Getter to return User value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {User} get User
   */
  getValue(): User {
    return this.value;
  }

  /**
   * @desc responsible function to create a User
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} name - user name
   * @param {string} lastname - user lastname
   * @param {string} taxvat - user taxvat
   * @param {string} email - user email
   * @param {string} password - user password
   * @returns {Either<Error, UserEntity>} returns the created User entity or an Error
   */
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

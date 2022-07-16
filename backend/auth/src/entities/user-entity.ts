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

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc User business domain
 */
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

  /**
   * @desc Getter to return name value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get name
   * @example
   * returns 'gabriel'
   */
  getName(): string {
    return this.name.getValue();
  }

  /**
   * @desc Getter to return lastname value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get lastname
   * @example
   * returns 'ferrari'
   */
  getLastname(): string {
    return this.lastname.getValue();
  }

  /**
   * @desc Getter to return taxvat value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get unformatted taxvat
   * @example
   * returns 11111111111
   */
  getTaxvat(): string {
    return this.taxvat.getValue();
  }

  /**
   * @desc Getter to return email value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get email
   * @example
   * returns 'test@gmail.com'
   */
  getEmail(): string {
    return this.email.getValue();
  }

  /**
   * @desc Getter to return password value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {string} get password
   */
  getPassword(): string {
    return this.password.getValue();
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

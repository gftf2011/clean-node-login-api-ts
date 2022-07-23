/**
 * Shared
 */
import { Either, left, right } from '../shared';

/**
 * Entities
 */
import { EmailEntity } from './email-entity';
import { EntityFactory } from './helpers/factory-methods';
import { PasswordEntity } from './password-entity';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Account business domain
 */
export class AccountEntity {
  private readonly email: EmailEntity;

  private readonly password: PasswordEntity;

  private constructor(email: EmailEntity, password: PasswordEntity) {
    this.email = email;
    this.password = password;
    Object.freeze(this);
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
   * @desc responsible function to create an Account
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @param {string} email - account email
   * @param {string} password - account password
   * @returns {Either<Error, UserEntity>} returns the created Account entity or an Error
   */
  static create(email: string, password: string): Either<Error, AccountEntity> {
    const emailOrError = EntityFactory.create(EmailEntity.name, email);
    const passwordOrError = EntityFactory.create(PasswordEntity.name, password);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    return right(
      new AccountEntity(
        emailOrError.value as EmailEntity,
        passwordOrError.value as PasswordEntity,
      ),
    );
  }
}

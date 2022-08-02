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
import { PasswordEntity } from './password-entity';

interface Account {
  email: string;
  password: string;
}

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Account business domain
 */
export class AccountEntity implements IEntity<Account> {
  private readonly value: Account;

  private constructor(email: EmailEntity, password: PasswordEntity) {
    this.value = {
      email: email.getValue(),
      password: password.getValue(),
    };
    Object.freeze(this);
  }

  /**
   * @desc Getter to return Account value
   * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
   * @returns {Account} get account
   */
  getValue(): Account {
    return this.value;
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

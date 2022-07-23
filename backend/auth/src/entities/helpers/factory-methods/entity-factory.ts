/**
 * Shared
 */
import { Either } from '../../../shared';

/**
 * Entities
 */
import { EmailEntity } from '../../email-entity';
import { IEntity } from '../../contracts';
import { LastnameEntity } from '../../lastname-entity';
import { NameEntity } from '../../name-entity';
import { PasswordEntity } from '../../password-entity';
import { TaxvatEntity } from '../../taxvat-entity';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Wraps the Entity creation logic in a single place
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/factory-method Factory Method} design pattern
 */
export class EntityFactory {
  /**
   * @desc performs the Individual Entity create
   * @param {string} entity - entity name
   * @param {string} value - initial value to verify inside Entity
   * @returns {Either<Error, IEntity>} returns if Entity was created successfully OR an Error was returned
   */
  static create(entity: string, value: string): Either<Error, IEntity<string>> {
    switch (entity) {
      case EmailEntity.name:
        return EmailEntity.create(value);
      case NameEntity.name:
        return NameEntity.create(value);
      case LastnameEntity.name:
        return LastnameEntity.create(value);
      case TaxvatEntity.name:
        return TaxvatEntity.create(value);
      case PasswordEntity.name:
        return PasswordEntity.create(value);
      default:
        return EmailEntity.create(value);
    }
  }
}

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

export class EntityFactory {
  static create(entity: string, value: string): Either<Error, IEntity> {
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

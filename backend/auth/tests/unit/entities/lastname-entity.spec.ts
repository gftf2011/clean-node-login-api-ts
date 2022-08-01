/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { InvalidLastnameError } from '../../../src/shared/errors';

/**
 * Entities
 */
import { LastnameEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('Lastname Entity', () => {
  const generateValidLastname = (): string => {
    return faker.lorem.word(2);
  };

  const normalizeValueToPascalCase = (value: string): string => {
    const valuePieces: string[] = value.split(/([ ]+)/g);

    const formattedPieces: string[] = valuePieces.map((piece: string) => {
      const newPiece: string = piece.toLocaleLowerCase();
      if (newPiece.length > 1) {
        return `${newPiece.charAt(0).toLocaleUpperCase()}${newPiece.substring(
          1,
          newPiece.length,
        )}`;
      }
      return newPiece.toLocaleUpperCase();
    });

    return formattedPieces.join('');
  };

  it('should not create lastname if "value" property is undefined', () => {
    const lastname: any = undefined;
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create lastname if "value" property is null', () => {
    const lastname: any = null;
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create lastname if "value" property is empty', () => {
    const lastname = '';
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create lastname if "value" property has only white spaces', () => {
    const lastname = ' ';
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create lastname if "value" property has only one character - (too few characters)', () => {
    const lastname = faker.lorem.word(1);
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should not create lastname if "value" property has more than 255 characters - (too many characters)', () => {
    const lastname = faker.lorem.word(256);
    const lastnameOrError = LastnameEntity.create(lastname);
    expect(lastnameOrError).toEqual(left(new InvalidLastnameError(lastname)));
  });

  it('should create lastname with correct parameters', () => {
    const lastname = generateValidLastname();
    const lastnameOrError = LastnameEntity.create(lastname);

    const lastnameEntity = lastnameOrError.value as LastnameEntity;

    expect(lastnameEntity.getValue()).toBe(lastname);
  });
});

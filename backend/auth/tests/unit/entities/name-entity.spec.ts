/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { InvalidNameError } from '../../../src/shared/errors';

/**
 * Entities
 */
import { NameEntity } from '../../../src/entities';

/**
 * Shared
 */
import { left } from '../../../src/shared';

describe('Name Entity', () => {
  const generateValidName = (): string => {
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

  it('should not create name if "value" property is undefined', () => {
    const name: any = undefined;
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create name if "value" property is null', () => {
    const name: any = null;
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create name if "value" property is empty', () => {
    const name = '';
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create name if "value" property has only white spaces', () => {
    const name = ' ';
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create name if "value" property has only one character - (too few characters)', () => {
    const name = faker.lorem.word(1);
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should not create name if "value" property has more than 255 characters - (too many characters)', () => {
    const name = faker.lorem.word(256);
    const nameOrError = NameEntity.create(name);
    expect(nameOrError).toEqual(left(new InvalidNameError(name)));
  });

  it('should create name with correct parameters', () => {
    const name = generateValidName();
    const nameOrError = NameEntity.create(name);

    const nameEntity = nameOrError.value as NameEntity;

    expect(nameEntity.getValue()).toBe(name);
    expect(nameEntity.getValueInPascalCase()).toBe(
      normalizeValueToPascalCase(name),
    );
  });
});

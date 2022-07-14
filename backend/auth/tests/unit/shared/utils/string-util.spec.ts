/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import {
  getOnlyCapitalLettersFromValue,
  getOnlyLowerCaseLettersFromValue,
  getOnlyNumbersFromValue,
  normalizeValueToLowerCase,
  normalizeValueToPascalCase,
  removeExtremitiesWhiteSpaces,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
} from '../../../../src/shared/utils';

describe('String Utils', () => {
  const WHITE_SPACES_REGEX = /(\s+)/g;
  const NOT_CAPITAL_LETTER_REGEX = /([^A-Z]*)/g;
  const NOT_LOWER_CASE_LETTER_REGEX = /([^a-z]*)/g;
  const NOT_NUMBERS_REGEX = /([^0-9]*)/g;

  const generateSentenceWithUpperLowerCaseAndNumbers = (): string => {
    return `${faker.lorem
      .words(faker.datatype.number({ min: 2, max: 20 }))
      .toLowerCase()}${faker.lorem
      .words(faker.datatype.number({ min: 2, max: 20 }))
      .toUpperCase()}${faker.datatype.number({ min: 1, max: 999999 })}`;
  };

  const generateSentenceOnlyInCapitalLetters = (): string => {
    return faker.lorem
      .sentence(faker.datatype.number({ min: 2, max: 10 }))
      .toUpperCase();
  };

  const generateSentenceOnlyInLowerCaseLetters = (): string => {
    return faker.lorem
      .sentence(faker.datatype.number({ min: 2, max: 10 }))
      .toLowerCase();
  };

  const normalizeSentenceToPascalCase = (value: string): string => {
    const valuePieces: string[] = value.split(WHITE_SPACES_REGEX);

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

  const generateSentenceOnlyInPascalCaseLetters = (): string => {
    const value = faker.lorem.sentence(
      faker.datatype.number({ min: 2, max: 10 }),
    );

    const valuePieces: string[] = value.split(WHITE_SPACES_REGEX);

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

  describe('"removeExtremitiesWhiteSpaces" method', () => {
    const generateValueWithWhiteSpaces = (): string => {
      return `${' '.repeat(
        faker.datatype.number({ min: 1, max: 10 }),
      )}${'a'.repeat(faker.datatype.number({ min: 1, max: 10 }))}${' '.repeat(
        faker.datatype.number({ min: 1, max: 10 }),
      )}`;
    };

    it('should return string with no white spaces in the edges', () => {
      const value = generateValueWithWhiteSpaces();

      expect(removeExtremitiesWhiteSpaces(value)).toBe(
        value.replace(WHITE_SPACES_REGEX, ''),
      );
    });
  });

  describe('"removeMultipleWhiteSpacesToSingleWhiteSpace" method', () => {
    const generateSentenceWithMoreThanOneWhiteSpaceSeparator = (): string => {
      return `${faker.lorem.words(
        faker.datatype.number({ min: 2, max: 10 }),
      )}`.replace(
        WHITE_SPACES_REGEX,
        ' '.repeat(faker.datatype.number({ min: 2, max: 5 })),
      );
    };

    it('should return string with ONE white space', () => {
      const value = ' '.repeat(faker.datatype.number({ min: 2, max: 10 }));

      expect(removeMultipleWhiteSpacesToSingleWhiteSpace(value)).toBe(' ');
    });

    it('should return sentence with only ONE white space separator between words', () => {
      const value = generateSentenceWithMoreThanOneWhiteSpaceSeparator();

      expect(removeMultipleWhiteSpacesToSingleWhiteSpace(value)).toBe(
        value.replace(WHITE_SPACES_REGEX, ' '),
      );
    });
  });

  describe('"getOnlyNumbersFromValue" method', () => {
    const generateSentenceWithCharactersAndNumbers = (): string => {
      return `${faker.lorem.words(
        faker.datatype.number({ min: 2, max: 20 }),
      )}${faker.datatype.number({ min: 1, max: 999999 })}`;
    };

    const generateSentenceWithOnlyCharacters = (): string => {
      return `${faker.lorem.words(faker.datatype.number({ min: 2, max: 20 }))}`;
    };

    it('should return string with only numbers', () => {
      const value = generateSentenceWithCharactersAndNumbers();

      expect(getOnlyNumbersFromValue(value)).toBe(
        value.replace(NOT_NUMBERS_REGEX, ''),
      );
    });

    it('should return empty string if sentence has no numbers', () => {
      const value = generateSentenceWithOnlyCharacters();

      expect(getOnlyNumbersFromValue(value)).toBe('');
    });
  });

  describe('"getOnlyCapitalLettersFromValue" method', () => {
    const generateSentenceWithOnlyLowerCaseLettersAndNumbers = (): string => {
      return `${faker.lorem
        .words(faker.datatype.number({ min: 2, max: 20 }))
        .toLowerCase()}${faker.datatype.number({ min: 1, max: 999999 })}`;
    };

    it('should return string with only capital letters', () => {
      const value = generateSentenceWithUpperLowerCaseAndNumbers();

      expect(getOnlyCapitalLettersFromValue(value)).toBe(
        value.replace(NOT_CAPITAL_LETTER_REGEX, ''),
      );
    });

    it('should return empty string if sentence has no capital letters', () => {
      const value = generateSentenceWithOnlyLowerCaseLettersAndNumbers();

      expect(getOnlyCapitalLettersFromValue(value)).toBe('');
    });
  });

  describe('"getOnlyLowerCaseLettersFromValue" method', () => {
    const generateSentenceWithOnlyCapitalLettersAndNumbers = (): string => {
      return `${faker.lorem
        .words(faker.datatype.number({ min: 2, max: 20 }))
        .toUpperCase()}${faker.datatype.number({ min: 1, max: 999999 })}`;
    };

    it('should return string with only lower case letters', () => {
      const value = generateSentenceWithUpperLowerCaseAndNumbers();

      expect(getOnlyLowerCaseLettersFromValue(value)).toBe(
        value.replace(NOT_LOWER_CASE_LETTER_REGEX, ''),
      );
    });

    it('should return empty string if sentence has no lower case letters', () => {
      const value = generateSentenceWithOnlyCapitalLettersAndNumbers();

      expect(getOnlyLowerCaseLettersFromValue(value)).toBe('');
    });
  });

  describe('"normalizeValueToLowerCase" method', () => {
    it('should return lower case string if value is in upper case', () => {
      const value = generateSentenceOnlyInCapitalLetters();

      expect(normalizeValueToLowerCase(value)).toBe(value.toLowerCase());
      expect(normalizeValueToLowerCase(value).length).toBe(value.length);
    });

    it('should return lower case string if value is in pascal case', () => {
      const value = generateSentenceOnlyInPascalCaseLetters();

      expect(normalizeValueToLowerCase(value)).toBe(value.toLowerCase());
      expect(normalizeValueToLowerCase(value).length).toBe(value.length);
    });

    it('should return same string if value is in lower case', () => {
      const value = generateSentenceOnlyInLowerCaseLetters();

      expect(normalizeValueToLowerCase(value)).toBe(value);
      expect(normalizeValueToLowerCase(value).length).toBe(value.length);
    });
  });

  describe('"normalizeValueToPascalCase" method', () => {
    it('should return pascal case sentence if value is in lower case', () => {
      const value = generateSentenceOnlyInLowerCaseLetters();

      expect(normalizeValueToPascalCase(value)).toBe(
        normalizeSentenceToPascalCase(value),
      );
      expect(normalizeValueToPascalCase(value).length).toBe(value.length);
    });

    it('should return pascal case sentence if value is in upper case', () => {
      const value = generateSentenceOnlyInCapitalLetters();

      expect(normalizeValueToPascalCase(value)).toBe(
        normalizeSentenceToPascalCase(value),
      );
      expect(normalizeValueToPascalCase(value).length).toBe(value.length);
    });

    it('should return same string if value is in pascal case', () => {
      const value = generateSentenceOnlyInPascalCaseLetters();

      expect(normalizeValueToPascalCase(value)).toBe(value);
      expect(normalizeValueToPascalCase(value).length).toBe(value.length);
    });

    it('should return single upper case letter if letter is in lower case', () => {
      const value = faker.lorem
        .word(faker.datatype.number({ min: 1, max: 1 }))
        .toLowerCase();

      expect(normalizeValueToPascalCase(value)).toBe(value.toUpperCase());
      expect(normalizeValueToPascalCase(value).length).toBe(1);
    });
  });
});

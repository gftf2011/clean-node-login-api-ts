const SINGLE_WHITE_SPACE_SEPARATOR = ' ';

const EMPTY_CHARACTER_SEPARATOR = '';

const NOT_CAPITAL_LETTER_REGEX = /([^A-Z]*)/g;
const NOT_LOWER_CASE_LETTER_REGEX = /([^a-z]*)/g;
const NOT_NUMBER_REGEX = /([^0-9]*)/g;

const MULTI_WHITE_SPACES_REGEX = /(\s+)/g;

export const removeExtremitiesWhiteSpaces = (value: string): string => {
  return value.trim();
};

export const removeMultipleWhiteSpacesToSingleWhiteSpace = (
  value: string,
): string => {
  return value.replace(MULTI_WHITE_SPACES_REGEX, SINGLE_WHITE_SPACE_SEPARATOR);
};

export const getOnlyNumbersFromValue = (value: string): string => {
  return value.replace(NOT_NUMBER_REGEX, EMPTY_CHARACTER_SEPARATOR);
};

export const getOnlyCapitalLettersFromValue = (value: string): string => {
  return value.replace(NOT_CAPITAL_LETTER_REGEX, EMPTY_CHARACTER_SEPARATOR);
};

export const getOnlyLowerCaseLettersFromValue = (value: string): string => {
  return value.replace(NOT_LOWER_CASE_LETTER_REGEX, EMPTY_CHARACTER_SEPARATOR);
};

export const normalizeValueToLowerCase = (value: string): string => {
  return value.toLocaleLowerCase().trim();
};

export const normalizeValueToPascalCase = (value: string): string => {
  const valuePieces: string[] = value.split(MULTI_WHITE_SPACES_REGEX);

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

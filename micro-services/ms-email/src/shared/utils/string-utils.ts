const EMAIL_ADDRESS_SEPARATOR: string = '@'

const EMAIL_DOMAIN_SEPARATOR: string = '.'

const SINGLE_WHITE_SPACE_SEPARATOR: string = ' '

const MULTI_WHITE_SPACES_REGEX: RegExp = /([ ]+)/g

export const removeExtremitiesWhiteSpaces = (value: string): string => {
  return value.trim()
}

export const removeMultipleWhiteSpacesToSingleWhiteSpace = (value: string): string => {
  return value.replace(MULTI_WHITE_SPACES_REGEX, SINGLE_WHITE_SPACE_SEPARATOR)
}

export const getEmailAccount = (email: string): string => {
  return email.split(EMAIL_ADDRESS_SEPARATOR)[0]
}

export const getEmailAddress = (email: string): string => {
  return email.split(EMAIL_ADDRESS_SEPARATOR)[1]
}

export const getEmailDomainsFromAddress = (address: string): string[] => {
  return address.split(EMAIL_DOMAIN_SEPARATOR)
}

export const normalizeValueToPascalCase = (value: string): string => {
  const valuePieces: string[] = value.split(MULTI_WHITE_SPACES_REGEX)

  const formattedPieces: string[] = valuePieces.map((piece: string) => {
    const newPiece: string = piece.toLocaleLowerCase()
    if (newPiece.length > 1) {
      return `${newPiece.charAt(0).toLocaleUpperCase()}${newPiece.substring(1, newPiece.length)}`
    }
    return newPiece.toLocaleUpperCase()
  })

  return formattedPieces.join('')
}

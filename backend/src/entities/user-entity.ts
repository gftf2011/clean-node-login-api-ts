/**
 * Shared
 */
import { Either, left, right } from '../shared'
import { InvalidEmailError, InvalidLastnameError, InvalidNameError, InvalidTaxvatError, InvalidPasswordError } from '../shared/errors'
import {
  clearTaxvat,
  isEmailValid,
  hasPasswordAnyEmptySpace,
  isTaxvatInBlacklist,
  removeExtremitiesWhiteSpaces,
  hasTaxvatCorrectLength,
  hasTaxvatOnlyDigits,
  isTaxvatFirstDigitValid,
  isTaxvatSecondDigitValid,
  getEmailAccount,
  getEmailAddress,
  getEmailDomainsFromAddress,
  removeMultipleWhiteSpacesToSingleWhiteSpace,
  getOnlyNumbersFromValue,
  getOnlyCapitalLettersFromValue,
  getOnlyLowerCaseLettersFromValue,
  getOnlySpecialCharactersFromValue,
  normalizeValueToPascalCase
} from '../shared/utils'

export class UserEntity {
  private readonly name: string
  private readonly lastname: string
  private readonly taxvat: string
  private readonly email: string
  private readonly password: string

  private constructor (name: string, lastname: string, taxvat: string, email: string, password: string) {
    this.name = name
    this.lastname = lastname
    this.taxvat = taxvat
    this.email = email
    this.password = password
    Object.freeze(this)
  }

  getName (): string {
    return this.name
  }

  getLastname (): string {
    return this.lastname
  }

  getTaxvat (): string {
    return this.taxvat
  }

  getEmail (): string {
    return this.email
  }

  getPassword (): string {
    return this.password
  }

  private static validateName (name: string): boolean {
    if (!name) {
      return false
    }
    const cleanName = removeMultipleWhiteSpacesToSingleWhiteSpace(removeExtremitiesWhiteSpaces(name))
    if (cleanName.length < 2 || cleanName.length > 255) {
      return false
    }
    return true
  }

  private static validateLastname (lastname: string): boolean {
    if (!lastname) {
      return false
    }
    const cleanLastname = removeMultipleWhiteSpacesToSingleWhiteSpace(removeExtremitiesWhiteSpaces(lastname))
    if (cleanLastname.length < 2 || cleanLastname.length > 255) {
      return false
    }
    return true
  }

  private static validateTaxvat (taxvat: string): boolean {
    if (!taxvat) {
      return false
    }

    const clearedTaxvat: string = clearTaxvat(taxvat)

    if (!hasTaxvatCorrectLength(clearedTaxvat)) {
      return false
    }

    if (isTaxvatInBlacklist(clearedTaxvat)) {
      return false
    }

    if (!hasTaxvatOnlyDigits(clearedTaxvat)) {
      return false
    }

    if (!isTaxvatFirstDigitValid(clearedTaxvat) && !isTaxvatSecondDigitValid(clearedTaxvat)) {
      return false
    }

    return true
  }

  private static validateEmail (email: string): boolean {
    if (!email) {
      return false
    }
    if (email.length > 255) {
      return false
    }
    if (!isEmailValid(email)) {
      return false
    }
    const account = getEmailAccount(email)
    const address = getEmailAddress(email)
    if (account.length > 64) {
      return false
    }
    if (getEmailDomainsFromAddress(address).some(function (part) {
      return part.length > 63
    })) {
      return false
    }
    return true
  }

  private static validatePassword (password: string): boolean {
    const pass: string = password
    if (!pass || pass.length < 11) {
      return false
    }
    if (hasPasswordAnyEmptySpace(pass)) {
      return false
    }
    const onlyNumbers: string = getOnlyNumbersFromValue(pass)
    if (onlyNumbers.length < 8) {
      return false
    }
    const onlyCapitalLetters: string = getOnlyCapitalLettersFromValue(pass)
    if (onlyCapitalLetters.length < 1) {
      return false
    }
    const onlyLowerCaseLetters: string = getOnlyLowerCaseLettersFromValue(pass)
    if (onlyLowerCaseLetters.length < 1) {
      return false
    }
    const onlySpecialCharacters: string = getOnlySpecialCharactersFromValue(pass)
    if (onlySpecialCharacters.length < 1) {
      return false
    }
    return true
  }

  private static validate (name: string, lastname: string, taxvat: string, email: string, password: string): Either<Error, true> {
    if (!UserEntity.validateName(name)) {
      return left(new InvalidNameError(name))
    }
    if (!UserEntity.validateLastname(lastname)) {
      return left(new InvalidLastnameError(lastname))
    }
    if (!UserEntity.validateTaxvat(taxvat)) {
      return left(new InvalidTaxvatError(taxvat))
    }
    if (!UserEntity.validateEmail(email)) {
      return left(new InvalidEmailError(email))
    }
    if (!UserEntity.validatePassword(password)) {
      return left(new InvalidPasswordError(password))
    }
    return right(true)
  }

  static create (name: string, lastname: string, taxvat: string, email: string, password: string): Either<Error, UserEntity> {
    const either = UserEntity.validate(name, lastname, taxvat, email, password)
    if (either.isRight()) {
      return right(new UserEntity(
        normalizeValueToPascalCase(
          removeMultipleWhiteSpacesToSingleWhiteSpace(
            removeExtremitiesWhiteSpaces(name)
          )
        ),
        normalizeValueToPascalCase(
          removeMultipleWhiteSpacesToSingleWhiteSpace(
            removeExtremitiesWhiteSpaces(lastname)
          )
        ),
        clearTaxvat(taxvat),
        email,
        password
      ))
    }
    return left(either.value)
  }
}

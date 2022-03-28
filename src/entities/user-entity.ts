/**
 * Shared
 */
import { Either, left, right } from '@/shared/either'

/**
 * Entities | Errors
 */
import { IDomainError, InvalidEmailError, InvalidLastnameError, InvalidNameError, InvalidTaxvatError, InvalidPasswordError } from '@/entities/errors'

const EMAIL_REGEX: RegExp = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/g
const TAXVAT_BASIC_REGEX: RegExp = /^([0-9]{3})\.([0-9]{3})\.([0-9]{3})-([0-9]{2})$/g
const TAXVAT_BASIC_ONLY_NUMBERS_REGEX: RegExp = /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g

const NOT_CAPITAL_LETTER_REGEX: RegExp = /([^A-Z]*)/g
const NOT_LOWER_CASE_LETTER_REGEX: RegExp = /([^a-z]*)/g
const NOT_NUMBER_REGEX: RegExp = /([^0-9]*)/g
const NOT_SPECIAL_CHARACTER_REGEX: RegExp = /([^!@#$%&?]*)/g
const NO_SPACE_REGEX: RegExp = /([ ]*)/g

const EMPTY_CHARACTER: string = ''
const EMAIL_ADDRESS_SEPARATOR: string = '@'
const EMAIL_DOMAIN_SEPARATOR: string = '.'

export class UserEntity {
  private readonly name: string
  private readonly lastname: string
  private readonly taxvat: string
  private readonly email: string
  private readonly password: string
  // private readonly hash: string

  private constructor (name: string, lastname: string, taxvat: string, email: string, password: string) {
    this.name = name
    this.lastname = lastname
    this.taxvat = taxvat
    this.email = email
    this.password = password
    // this.hash = hash
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

  // getHash (): string {
  //   return this.hash
  // }

  private static validateName (name: string): boolean {
    if (!name || name.trim().length < 2 || name.trim().length > 255) {
      return false
    }
    return true
  }

  private static validateLastname (lastname: string): boolean {
    if (!lastname || lastname.trim().length < 2 || lastname.trim().length > 255) {
      return false
    }
    return true
  }

  private static validateTaxvat (taxvat: string): boolean {
    if (taxvat.length !== 14 && taxvat.length !== 11) {
      return false
    }

    const validateFirstDigit = (value1: string, value2: string, value3: string, validationDigit: string): boolean => {
      const num1: number = (10 * +String(value1).charAt(0))
      const num2: number = (9 * +String(value1).charAt(1))
      const num3: number = (8 * +String(value1).charAt(2))

      const num4: number = (7 * +String(value2).charAt(0))
      const num5: number = (6 * +String(value2).charAt(1))
      const num6: number = (5 * +String(value2).charAt(2))

      const num7: number = (4 * +String(value3).charAt(0))
      const num8: number = (3 * +String(value3).charAt(1))
      const num9: number = (2 * +String(value3).charAt(2))

      let result = (((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9) * 10) % 11)

      if (result === 10) {
        result = 0
      }

      return +validationDigit === result
    }

    const validateSecondDigit = (value1: string, value2: string, value3: string, firstValidationDigit: string, secondValidationDigit: string): boolean => {
      const num1: number = (11 * +String(value1).charAt(0))
      const num2: number = (10 * +String(value1).charAt(1))
      const num3: number = (9 * +String(value1).charAt(2))

      const num4: number = (8 * +String(value2).charAt(0))
      const num5: number = (7 * +String(value2).charAt(1))
      const num6: number = (6 * +String(value2).charAt(2))

      const num7: number = (5 * +String(value3).charAt(0))
      const num8: number = (4 * +String(value3).charAt(1))
      const num9: number = (3 * +String(value3).charAt(2))

      const num10: number = (2 * +String(firstValidationDigit))

      let result = (((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10) * 10) % 11)

      if (result === 10) {
        result = 0
      }

      return +secondValidationDigit === result
    }

    if (taxvat.length === 14 && taxvat.match(TAXVAT_BASIC_REGEX)) {
      const groups = TAXVAT_BASIC_REGEX.exec(taxvat)

      const group1 = groups[1]
      const group2 = groups[2]
      const group3 = groups[3]
      const validationDigits = groups[4]

      if (
        validateFirstDigit(String(group1), String(group2), String(group3), String(validationDigits).charAt(0)) &&
        validateSecondDigit(String(group1), String(group2), String(group3), String(validationDigits).charAt(0), String(validationDigits).charAt(1))
      ) {
        return true
      }
      return false
    }
    if (taxvat.length === 11 && taxvat.match(TAXVAT_BASIC_ONLY_NUMBERS_REGEX)) {
      const groups = TAXVAT_BASIC_ONLY_NUMBERS_REGEX.exec(taxvat)

      const group1 = groups[1]
      const group2 = groups[2]
      const group3 = groups[3]
      const validationDigits = groups[4]

      if (
        validateFirstDigit(String(group1), String(group2), String(group3), String(validationDigits).charAt(0)) &&
        validateSecondDigit(String(group1), String(group2), String(group3), String(validationDigits).charAt(0), String(validationDigits).charAt(1))
      ) {
        return true
      }
      return false
    }
    return false
  }

  private static validateEmail (email: string): boolean {
    if (!email) {
      return false
    }
    if (email.length > 256) {
      return false
    }
    if (!EMAIL_REGEX.test(email)) {
      return false
    }
    const [account, address] = email.split(EMAIL_ADDRESS_SEPARATOR)
    if (account.length > 64) {
      return false
    }
    const domainParts = address.split(EMAIL_DOMAIN_SEPARATOR)
    if (domainParts.some(function (part) {
      return part.length > 63
    })) {
      return false
    }
    return true
  }

  private static validatePassword (password: string): boolean {
    const pass: string = password.replace(NO_SPACE_REGEX, EMPTY_CHARACTER)
    if (!pass || pass.length < 11) {
      return false
    }
    const onlyNumbers: string = pass.replace(NOT_NUMBER_REGEX, EMPTY_CHARACTER)
    if (onlyNumbers.length < 8) {
      return false
    }
    const onlyCapitalLetters: string = pass.replace(NOT_CAPITAL_LETTER_REGEX, EMPTY_CHARACTER)
    if (onlyCapitalLetters.length < 1) {
      return false
    }
    const onlyLowerCaseLetters: string = pass.replace(NOT_LOWER_CASE_LETTER_REGEX, EMPTY_CHARACTER)
    if (onlyLowerCaseLetters.length < 1) {
      return false
    }
    const onlySpecialCharacters: string = pass.replace(NOT_SPECIAL_CHARACTER_REGEX, EMPTY_CHARACTER)
    if (onlySpecialCharacters.length < 1) {
      return false
    }
    return true
  }

  private static validate (name: string, lastname: string, taxvat: string, email: string, password: string): Either<IDomainError, true> {
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
      return left(new InvalidPasswordError(email))
    }
    return right(true)
  }

  static create (name: string, lastname: string, taxvat: string, email: string, password: string): Either<IDomainError, UserEntity> {
    const either = UserEntity.validate(name, lastname, taxvat, email, password)
    if (either.isRight()) {
      return right(new UserEntity(name, lastname, taxvat, email, password))
    }
    return left(either.value)
  }
}

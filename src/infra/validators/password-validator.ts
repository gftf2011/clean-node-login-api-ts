import { IPasswordValidator } from '@/presentation/ports'

const NOT_CAPITAL_LETTER_REGEX: RegExp = /([^A-Z]*)/g
const NOT_LOWER_CASE_LETTER_REGEX: RegExp = /([^a-z]*)/g
const NOT_NUMBER_REGEX: RegExp = /([^0-9]*)/g
const NOT_SPECIAL_CHARACTER_REGEX: RegExp = /([^!@#$%&?]*)/g
const NO_SPACE_REGEX: RegExp = /([ ]*)/g

const EMPTY_CHARACTER: string = ''

/**
  * Singleton class
  *
  * This class manages the global instance for Password Validator
  */
export class PasswordValidator implements IPasswordValidator {
  private static instance: PasswordValidator

  private constructor () {}

  static getInstance (): PasswordValidator {
    if (!PasswordValidator.instance) {
      PasswordValidator.instance = new PasswordValidator()
    }
    return PasswordValidator.instance
  }

  isValid (password: string): boolean {
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
}

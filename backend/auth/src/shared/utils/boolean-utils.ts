/**
 * @desc Email regex
 * @author Esteban Küber
 * @link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
const VALID_EMAIL_REGEX: RegExp =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
const PASSWORD_HAS_ANY_SPACE_REGEX: RegExp = /([ ]+)/g

const TAXVAT_BLACKLIST: string[] = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
]

const TAXVAT_CORRECT_LENGTH: number = 11

/**
 * @desc Utility method to tell if email is valid
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @param {string} email - user email
 * @returns {boolean} return if email is valid
 */
export const isEmailValid = (email: string): boolean => {
  return VALID_EMAIL_REGEX.test(email)
}

export const hasPasswordAnyEmptySpace = (password: string): boolean => {
  return PASSWORD_HAS_ANY_SPACE_REGEX.test(password)
}

export const isTaxvatInBlacklist = (taxvat: string): boolean => {
  return TAXVAT_BLACKLIST.some((value: string) => value === taxvat)
}

export const hasTaxvatCorrectLength = (taxvat: string): boolean => {
  return taxvat.length === TAXVAT_CORRECT_LENGTH
}

export const hasTaxvatOnlyDigits = (taxvat: string): boolean => {
  const TAXVAT_ONLY_NUMBERS_REGEX: RegExp =
    /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g

  return TAXVAT_ONLY_NUMBERS_REGEX.test(taxvat)
}

export const isTaxvatFirstDigitValid = (taxvat: string): boolean => {
  const TAXVAT_ONLY_NUMBERS_REGEX: RegExp =
    /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g

  const groups = TAXVAT_ONLY_NUMBERS_REGEX.exec(taxvat)

  const value1 = groups[1]
  const value2 = groups[2]
  const value3 = groups[3]
  const validationDigits = groups[4]

  const num1: number = 10 * +String(value1).charAt(0)
  const num2: number = 9 * +String(value1).charAt(1)
  const num3: number = 8 * +String(value1).charAt(2)

  const num4: number = 7 * +String(value2).charAt(0)
  const num5: number = 6 * +String(value2).charAt(1)
  const num6: number = 5 * +String(value2).charAt(2)

  const num7: number = 4 * +String(value3).charAt(0)
  const num8: number = 3 * +String(value3).charAt(1)
  const num9: number = 2 * +String(value3).charAt(2)

  let result =
    ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9) * 10) % 11

  if (result === 10) {
    result = 0
  }

  return +String(validationDigits).charAt(0) === result
}

export const isTaxvatSecondDigitValid = (taxvat: string): boolean => {
  const TAXVAT_ONLY_NUMBERS_REGEX: RegExp =
    /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g

  const groups = TAXVAT_ONLY_NUMBERS_REGEX.exec(taxvat)

  const value1 = groups[1]
  const value2 = groups[2]
  const value3 = groups[3]
  const validationDigits = groups[4]

  const num1: number = 11 * +String(value1).charAt(0)
  const num2: number = 10 * +String(value1).charAt(1)
  const num3: number = 9 * +String(value1).charAt(2)

  const num4: number = 8 * +String(value2).charAt(0)
  const num5: number = 7 * +String(value2).charAt(1)
  const num6: number = 6 * +String(value2).charAt(2)

  const num7: number = 5 * +String(value3).charAt(0)
  const num8: number = 4 * +String(value3).charAt(1)
  const num9: number = 3 * +String(value3).charAt(2)

  const num10: number = 2 * +String(validationDigits).charAt(0)

  let result =
    ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10) *
      10) %
    11

  if (result === 10) {
    result = 0
  }

  return +String(validationDigits).charAt(1) === result
}

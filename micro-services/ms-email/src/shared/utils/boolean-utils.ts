/**
 * @desc Email regex
 * @author Esteban Küber
 * @link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
const VALID_EMAIL_REGEX: RegExp =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

/**
 * @desc Utility method to tell if email is valid
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @param {string} email - user email
 * @returns {boolean} return if email is valid
 */
export const isEmailValid = (email: string): boolean => {
  return VALID_EMAIL_REGEX.test(email)
}

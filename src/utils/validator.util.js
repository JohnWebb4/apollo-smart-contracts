/**
 * Check is input is an alpha-numeric string
 * @param {*} input input to check
 * @returns {boolean} is alpha-numeric
 */
function isAlphaNumeric(input) {
  if (typeof input !== "string") {
    return false;
  }

  return /^[a-zA-Z_\d]*$/.test(input);
}

/**
 * Check if input is string with equal to or fewer characters than amount
 * @param {*} input input to check
 * @param {number} length maximum length of input
 * @returns {boolean} is less than or equal to specified number
 */
function isXCharactersOrLess(input, length) {
  if (typeof input !== "string") {
    return false;
  }

  return input.length <= length;
}

module.exports = { isAlphaNumeric, isXCharactersOrLess };

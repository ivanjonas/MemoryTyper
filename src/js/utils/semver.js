/**
 * Created by jonasninja on 10/26/2015.
 */
'use strict'

const parseErrorMessage = 'String not formatted to semver specifications'
/**
 * Returns `True` if the first param is greater than the second param
 * @param first a semver string of the form described at http://www.semver.org
 * @param second the base semver string to which the first is compared.
 */
exports.isGreater = function isVersionGreater (first, second) {
  // throw an error if it cannot be parsed.

  const partsFirst = parse(first)
  if (second == null) {
    return true
  }
  const partsSecond = parse(second)

  let result = false

  if (partsFirst.major !== partsSecond.major) {
    result = partsFirst.major > partsSecond.major
  } else if (partsFirst.minor !== partsSecond.minor) {
    result = partsFirst.minor > partsSecond.minor
  } else if (partsFirst.patch !== partsSecond.patch) {
    result = partsFirst.patch > partsSecond.patch
  }
  return result
}

function parse (semverString) {
  let major, minor, patch
  const parts = semverString.split('.')

  if (parts.length !== 3) {
    throw new Error(parseErrorMessage)
  }

  try {
    major = parseInt(parts[0], 10)
    minor = parseInt(parts[1], 10)
    patch = parseInt(parts[2], 10)
  } catch (e) {
    throw new Error(parseErrorMessage)
  }

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    throw new Error(parseErrorMessage)
  }

  return {major, minor, patch}
}

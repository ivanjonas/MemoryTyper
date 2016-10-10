/**
 * Created by jonasninja on 10/26/2015.
 */
'use strict'

const parseErrorMessage = 'String not formatted to semver specifications'
const updaters = [to0_3_0, to0_3_1] // array because order matters

exports.isGreater = isVersionGreater
exports.updateData = update

/**
 * Returns `True` if the first param is greater than the second param
 * @param first a semver string of the form described at http://www.semver.org
 * @param second the base semver string to which the first is compared.
 */
function isVersionGreater (first, second) {
  var partsSecond
  var result
  const partsFirst = parse(first)
  if (second == null) {
    return true
  }
  partsSecond = parse(second)

  result = false

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

/**
 * Given a function object, return the version represented in the name
 * @param func
 */
function functionToVersion (func) {
  var name = func.name.replace(/_/g, '.')
  return name.replace('to', '')
}

function to0_3_0 () {
  // updates old data to the format required by 0.3.0
  console.log('updating data to 0.3.0 format')

  let texts = JSON.parse(window.localStorage.getItem('texts')) || [] // an array of textObjs
  for (let text of texts) {
    let due = new Date()
    due.setMilliseconds(0)
    due.setSeconds(0)
    due.setMinutes(0)
    due.setHours(0)

    text.reviews = {
      successes: 0,
      continuousSuccesses: 0,
      failures: 0,
      lastResult: null, // 'success' or 'failure'
      lastSuccess: null,
      lastFailure: null,
      dueDate: due.getTime()
    }
  }

  window.localStorage.setItem('texts', JSON.stringify(texts))
  setAppVersion('0.3.0')
}

function to0_3_1 () {
  // removes obsoleted review metadata that was introduced in 0.3.0
  console.log('updating data to 0.3.1 format')

  let texts = JSON.parse(window.localStorage.getItem('texts')) || [] // an array of textObjs
  for (let text of texts) delete text.reviews.lastResult

  window.localStorage.setItem('texts', JSON.stringify(texts))
  setAppVersion('0.3.1')
}

function setAppVersion (version) {
  window.localStorage.setItem('version', version)
}

function getAppVersion () {
  var version = window.localStorage.getItem('version')
  if (!version) {
    version = '0.0.0'
  }
  return version
}

function update () {
  // this would run before absolutely anything else in the application. Assume nothing in other modules.
  for (var updater of updaters) {
    const currVer = getAppVersion()
    if (isVersionGreater(functionToVersion(updater), currVer)) {
      updater()
    }
  }
}

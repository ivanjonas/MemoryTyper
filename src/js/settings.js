/**
 * Created by jonasninja on 10/8/2015.
 * loadUserSettings should be called as soon as possible during initial application load
 */
'use strict'

const domManipulation = require('./utils/domManipulation')

const keys = ['require-capitalization', 'require-punctuation', 'allow-wrong-input', 'require-newline']
let typingOptions = { // these defaults may be overwritten by #loadUserSettings()
  'require-capitalization': true,
  'require-punctuation': true,
  'allow-wrong-input': false,
  'require-newline': true
}
const __setFunctions = {
  'require-capitalization': setRequireCapitalization,
  'require-punctuation': setRequirePunctuation,
  'allow-wrong-input': setAllowWrongInput,
  'require-newline': setRequireNewline
}

module.exports = {
  typingOptions: typingOptions,
  loadUserSettings: loadUserSettings,
  updateOptionsHandler: updateOptionsHandler,
  getRequireCapitalization: getRequireCapitalization,
  getRequirePunctuation: getRequirePunctuation,
  getAllowWrongInput: getAllowWrongInput,
  getRequireNewline: getRequireNewline,
  setRequireCapitalization: setRequireCapitalization,
  setRequirePunctuation: setRequirePunctuation,
  setAllowWrongInput: setAllowWrongInput,
  setRequireNewline: setRequireNewline,
  set: set
}

function loadUserSettings () {
  for (let key of keys) {
    const savedSetting = get(key)
    if (savedSetting != null) {
      typingOptions[key] = savedSetting
    }
  }
  domManipulation.setUserSettings(typingOptions)
}

function updateOptionsHandler () {
  var optionKey = this.id.replace('option-', '')
  set(optionKey, this.checked)
}

function getRequireCapitalization () {
  return typingOptions['require-capitalization']
}
function getRequirePunctuation () {
  return typingOptions['require-punctuation']
}
function getAllowWrongInput () {
  return typingOptions['allow-wrong-input']
}
function getRequireNewline () {
  return typingOptions['require-newline']
}

function setRequireCapitalization (bool) {
  typingOptions['require-capitalization'] = bool
  window.localStorage.setItem('settings--require-capitalization', bool)
}
function setRequirePunctuation (bool) {
  typingOptions['require-punctuation'] = bool
  window.localStorage.setItem('settings--require-punctuation', bool)
}
function setAllowWrongInput (bool) {
  typingOptions['allow-wrong-input'] = bool
  window.localStorage.setItem('settings--allow-wrong-input', bool)
}
function setRequireNewline (bool) {
  typingOptions['require-newline'] = bool
  window.localStorage.setItem('settings--require-newline', bool)
}

function set (settingString, bool) {
  // use the appropriate function to set the new value
  __setFunctions[settingString](bool)
}

function get (key) {
  return JSON.parse(window.localStorage.getItem('settings--' + key))
}

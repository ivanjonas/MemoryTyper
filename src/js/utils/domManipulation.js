/**
 * Created by jonasninja on 10/8/2015.
 * helper functions for dealing with the DOM
 */
'use strict'

module.exports = {
  revealText: function revealText () {
    $('.text').show().fixHeight()
    $('button.practice-mode').show().filter('button.mode-typing').text('Hide text and start typing')
  },

  hideText: function hideText () {
    $('.text').hide()
    $('button.practice-mode').hide().filter('button.mode-typing').show().text('Show text')
    $('.output').focus()
  },

  changeMode: function changeMode (selectorString) {
    $('div.practice-mode').hide().filter(selectorString).show()
  },

  resetMode: function resetMode () {
    module.exports.changeMode('#mode-typing')
  },

  setUserSettings: function setUserSettings (settings) {
    for (let setting in settings) {
      jQuery('#option-' + setting).prop('checked', settings[setting])
    }
  }
}

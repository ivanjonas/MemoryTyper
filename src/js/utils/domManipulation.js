/**
 * Created by jonasninja on 10/8/2015.
 * helper functions for dealing with the DOM
 */

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
  }
}

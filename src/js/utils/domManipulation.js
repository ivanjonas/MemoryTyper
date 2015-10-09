/**
 * Created by jonasninja on 10/8/2015.
 * helper functions for dealing with the DOM
 */

module.exports = {
  revealText: function revealText () {
    $('.text').show().fixHeight()
    $('.go').text('Hide text and start typing')
  },

  hideText: function hideText () {
    $('.text').hide()
    $('.go').text('Show text')
    $('.output').focus()
  }
}

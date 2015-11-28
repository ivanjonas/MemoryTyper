/**
 * Created by jonasninja on 10/8/2015.
 * helper functions for dealing with the DOM
 */
'use strict'

const cardDom = '' + // TODO use Polymer element here
  '<div class="text-card">' +
  '<div class="card-info">' +
  '<div class="card-row"><span class="title"></span></div>' +
  '<div class="card-row"></div>' +
  '</div>' +
  '<div class="card-feedback">' +
  '<div class="flexcontainer">' +
  '<div class="btn success"><span class="glyphicon glyphicon-ok"></span></div>' +
  '<div class="btn failure"><span class="glyphicon glyphicon-remove"></span></div>' +
  '</div></div>' +
  '<div class="card-menu-container">' +
  '<span class="glyphicon glyphicon-cog card-menu"></span>' +
  '</div>' +
  '</div>'

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
  },

  generateCard: function generateCard (textObj) {
    var card = $(cardDom)
    card.find('.title').text(textObj.title)
    card.find('.card-menu').prop('data-text-id', textObj.id)
    card.data('textId', textObj.id)
    if (textObj.reviews.dueDate <= (new Date()).getTime()) {
      card.addClass('due')
    }
    return card
  }
}

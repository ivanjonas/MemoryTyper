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
  '<div class="btn success" data-toggle="tooltip" data-placement="right" title=""><span class="glyphicon glyphicon-ok"></span></div>' +
  '<div class="btn failure" data-toggle="tooltip" data-placement="right" title=""><span class="glyphicon glyphicon-remove"></span></div>' +
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
      card.find('.btn.success').prop('title', 'You remember this text! It will be due again on ' +
        simpleDateString(textObj.generateReviewDate(true)))
      const failureButton = card.find('.btn.failure')
      failureButton.prop('title', 'You cannot completely recall this text. The due date progression will be reset.')
      if (textObj.reviews.continuousSuccesses === 0) {
        failureButton.hide()
      }
    } else {
      card.prop('title', 'this card is due on ' + (new Date(textObj.reviews.dueDate)).toUTCString().substr(0, 11))
    }
    return card
  },

  windowResizeHandler: windowResizeHandler
}

function windowResizeHandler () {
  $('.text').fixHeight()
}

/**
 * Takes a Date object and returns it as a string of the form 'Weekday Month Day'. For example,
 * - Friday, December 4
 * - Tuesday, January 12
 *
 * The year is omitted because the date passed in is expected to be in the near future. The year can be inferred easily.
 * @param date
 * @return {string} a human-readable representation of the date
 */
function simpleDateString (date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December']
  return weekdays[date.getDay()] + ' ' + months[date.getMonth()] + ' ' + date.getDate()
}

/**
 * Created by jonasninja on 12/8/2015.
 */
'use strict'

const textsCrud = require('./textsCrud')
const textObj = require('./textObj')

module.exports = {
  addNewText: function addNewText (e) {
    let $title = $('#text-add-title')
    let $text = $('#text-add-text')
    const startingSuccessCount = Number.parseInt($('#text-add-reviewcount').val(), 10)
    var newTextObj = new textObj.TextObj($title.val(), $text.val(), startingSuccessCount)
    textsCrud.saveText(newTextObj)
    textsCrud.initLoad()
    $title.val('')
    $text.val('')
    $(e.target).closest('.modal').modal('hide')
  },

  editExistingText: function editExistingText (e) {
    var textId = $(e.target).closest('.modal').data('textId')
    textsCrud.editText(textId, $('#text-edit-title').val(), $('#text-edit-text').val())
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  },

  deleteExistingText: function deleteExistingText (e) {
    // TODO "are you sure?" Needs custom code for multiple Bootstrap modals
    textsCrud.deleteText($(e.target).closest('.modal').data('textId'))
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  },

  changeFirstReview: function changeFirstReview (e) {
    // when the user wants to add a new text that they already know fairly well.
    // every time this number changes (up to 8?), the span next to it will say in how many days it will be due.
    console.log('it works')
    let message = 'Your review will be due today'
    let number = $(this).val()

    // if number is not in valid range, set it to a valid number
    if (number === '') {
      number = 0
    }
    if (number < 0) {
      number = 0
    } else if (number > 8) {
      number = 8
    }
    $(this).val(number) // doesn't hurt if it's within valid range

    let daysForward = Math.min(Math.pow(2, number - 1), 122)
    if (number > 0) {
      message = 'your review will be due in ' + daysForward + ' day'
      if (number > 1) {
        message += 's'
      }
    }
    message += ' (' + addDays(noTime(new Date()), daysForward).toUTCString().substr(0, 11) + ')'
    $('.reviewcount-help').text(message)
  }
}

function addDays (date, days) { // TODO modularize, dedupe from textObj
  date.setDate(date.getDate() + days)
  return date
}
function noTime (date) { // TODO ditto
  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(0)
  date.setHours(0)
  return date
}

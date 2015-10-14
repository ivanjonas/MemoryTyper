/**
 * Created by Yvonne on 10/6/2015.
 */
'use strict'

const domManipulation = require('./utils/domManipulation')

exports.$timerDisplay = $('.timerDisplay')
exports.$results = $('.results')

/**
 * Starts or stops the timer if appropriate. This means setting the start and end times on the appropriate DOM
 * element.
 */
exports.manageTimer = function manageTimer (initialOutputLength, currentOutputLength, text) {
  // start the timer
  if (initialOutputLength === 0 && currentOutputLength >= 0) {
    this.$timerDisplay.text('timer running...').data('start', new Date())
  }
  // end the timer
  if (text.length === currentOutputLength) {
    this.endTimer(text)
  }
}

exports.endTimer = function endTimer (text) {
  var end = new Date()
  var duration = end - this.$timerDisplay.data('start')
  this.$timerDisplay.text('timer finished.').data('end', end)

  var wordCount = text.split(/\s+/).length
  var wpm = Math.round((wordCount / duration * 100000 * 60)) / 100

  this.$results.text(wordCount + ' words in ' + (duration / 1000) + ' seconds. ' + wpm + ' words per minute.')
}

exports.resetTimer = function resetTimer () {
  this.$timerDisplay.removeData('start end').text('timer reset')
  this.$results.text('')
  $('.output').removeClass('correct wrong').val('')
  domManipulation.revealText()
}

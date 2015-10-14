/**
 * Created by Yvonne on 10/6/2015.
 */
'use strict'

const domManipulation = require('./utils/domManipulation')
let $timerDisplay = $('.timerDisplay')
let $results = $('.results')

exports.$timerDisplay = $timerDisplay
exports.$results = $results
exports.manageTimer = manageTimer
exports.endTimer = endTimer
exports.isRunning = isRunning
exports.resetTimer = resetTimer

/**
 * Starts or stops the timer if appropriate. This means setting the start and end times on the appropriate DOM
 * element.
 */
function manageTimer (initialOutputLength, currentOutputLength, text) {
  // start the timer
  if (initialOutputLength === 0 && currentOutputLength >= 0) {
    $timerDisplay.text('timer running...').data('start', new Date()).removeData('end')
  }
  // end the timer
  if (text.length === currentOutputLength) {
    endTimer(text)
  }
}

function endTimer (text) {
  const end = new Date()
  const duration = end - $timerDisplay.data('start')
  $timerDisplay.text('timer finished.').data('end', end)

  const wordCount = text.split(/\s+/).length
  const wpm = Math.round((wordCount / duration * 100000 * 60)) / 100

  $results.text(wordCount + ' words in ' + (duration / 1000) + ' seconds. ' + wpm + ' words per minute.')
}

function resetTimer () {
  $timerDisplay.removeData('start end').text('timer reset')
  $results.text('')
  $('.output').removeClass('correct wrong').val('')
  domManipulation.revealText()
}

function isRunning () {
  if (!jQuery.hasData($timerDisplay.get(0))) {
    return false
  }
  return $timerDisplay.data('start') !== undefined && $timerDisplay.data('end') === undefined
}

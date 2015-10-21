/**
 * Created by jonasninja on 10/20/2015.
 * Module for the mode in which words and sentences are revealed for self-testing
 */
'use strict'

const tokenizer = require('./utils/tokenizer')
const domManipulation = require('./utils/domManipulation')

const $modeWord = $('#mode-word')
const $p = $modeWord.find('p')
let text
let tokens

exports.start = startModeWord
exports.revealWord = revealWord
exports.revealSentence = revealSentence
exports.reset = resetModeWord

function startModeWord () {
  domManipulation.changeMode($modeWord)
  $p.html('')
  $modeWord.find('button.btn-primary').show()
  $modeWord.find('button.reset').hide()

  text = $('#activity-area').data('textObj').text
  tokens = tokenizer.parse(text).slice(1)
}

function revealWord () {
  if (tokens.length) {
    const textEndIndex = tokens.shift().pos
    $p.html(breakify(text.slice(0, textEndIndex)))
  } else {
    $p.html(breakify(text))
    // change modes by changing the visibility of buttons.
    $modeWord.find('button.btn-primary').hide()
    $modeWord.find('button.reset').show()
  }
}

function revealSentence () {
  const len = unbreakify($p.html()).length
  // find the next period
  let nextPeriodIndex = len + text.slice(len).search(/[\.;]/) + 1

  // now show any additional whitespaces that may be necessary
  let whitespaces = text.slice(nextPeriodIndex).match(/[\.\s]*/)
  if (whitespaces == null) {
    // there are no periods left in the text! Show everything and end the practice.
    $p.html(breakify(text))
    $modeWord.find('button.btn-primary').hide()
    $modeWord.find('button.reset').show()
    return
  }
  if (whitespaces.length) {
    nextPeriodIndex += whitespaces.shift().length
  }
  $p.html(breakify(text.slice(0, nextPeriodIndex)))

  // also clean up the tokens list so the Word button works correctly.
  const newLen = unbreakify($p.html()).length
  while (tokens.length && tokens[0].pos <= newLen) {
    tokens.shift()
  }

  //
  if (newLen === text.length) {
    $modeWord.find('button.btn-primary').hide()
    $modeWord.find('button.reset').show()
  }
}

function resetModeWord () {
  startModeWord()
}

function breakify (string) {
  return string.replace(/\n/g, '<br>')
}

function unbreakify (string) {
  return string.replace(/<br>/g, '\n')
}

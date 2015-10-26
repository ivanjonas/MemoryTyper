/**
 * Created by jonasninja on 10/10/2015.
 * Module for running the Blur Mode
 */
'use strict'

const shuffle = require('../../node_modules/lodash/collection/shuffle')
const tokenizer = require('./utils/tokenizer')
const domManipulation = require('./utils/domManipulation')

const $modeBlur = $('#mode-blur')

exports.start = function () {
  domManipulation.changeMode($modeBlur)

  let contents = '<span class="word">'
  let unusedNums = []
  const text = $('#activity-area').data('textObj').text
  const tokens = tokenizer.parse(text)

  let lastPos = 0
  tokens.forEach(function (e, i) {
    const preText = text.slice(lastPos, e.pos)
    contents += preText + '</span><wbr/><span class="word"><span class="blurrable num-' + i + '">' + e.word + '</span>'
    lastPos += e.word.length + preText.length
    unusedNums.push(i)
  })
  contents += text.slice(lastPos) + '</span>'

  $modeBlur.data({
    'tokens': tokens,
    'unusedNums': shuffle(unusedNums)
  }).find('p').html(contents)
}

exports.blur = function () {
  // find up to 3 random words to blur
  let unusedNums = $modeBlur.data('unusedNums')

  if (unusedNums.length === 0) {
    resetBlurMode()
    return
  }

  $modeBlur.find('.unblurred').removeClass('unblurred')

  let numsToBlur = []
  for (var i = 3; i > 0 && unusedNums.length > 0; i--) {
    numsToBlur.push(unusedNums.pop())
  }
  numsToBlur.forEach(function (n) {
    $modeBlur.find('.num-' + n).addClass('blurred')
  })

  if (unusedNums.length === 0) {
    // replace the button with a Reset functionality
    $modeBlur.find('button.blur').text('Reset')
  }
}

exports.toggleBlur = function (event) {
  $modeBlur.find('.unblurred').removeClass('unblurred')
  $(event.target).toggleClass('unblurred')
}

exports.back = function () {
  domManipulation.changeMode('#mode-typing')
}

function resetBlurMode () {
  exports.start()
  $modeBlur.find('button.blur').text('Blur')
  $modeBlur.find('.unblurred').removeClass('unblurred')
}

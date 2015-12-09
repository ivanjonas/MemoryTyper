/**
 * Created by Yvonne on 2015-07-05.
 */
'use strict'

const domManipulation = require('./utils/domManipulation')
const timer = require('./timer')
let settings = require('./settings')
const equivalencies = [
  ['-', '‒', '–', '—', '―', '−'], // the last one is a "minus." http://codepen.io/jonas_ninja/pen/KdNvwK
  ['"', '“', '”'], // quotes are sometimes curly.
  ["'", '‘', '’']
]
let textObj

module.exports = {
  textObj: textObj,
  $output: $('.output'),
  keypressHandler: keypressHandler,
  keydownHandler: keydownHandler,
  start: start
}

/**
 * Should return true if it was a success and false otherwise. TODO it doesn't.
 * @param event
 */
function keypressHandler (event) {
  var text
  var target
  var $output = module.exports.$output
  var textObj = module.exports.textObj
  var input = String.fromCharCode(event.keyCode || event.which)
  var currentOutput = module.exports.$output.val()
  var currentOutputLength = currentOutput.length
  var initialOutputLength = currentOutputLength
  var options = settings.typingOptions

  event.preventDefault() // FIXME: does not prevent paste

  // don't run this handler when there is no text available, or when the text is done.
  text = textObj ? textObj.text : ''
  if (text.length === 0 || text === currentOutput) {
    return
  }
  target = text[currentOutputLength] // FIXME check for aioob
  const isCorrect = isInputCorrect()

  if (isCorrect) {
    $output.addClass('correct').removeClass('wrong')
    /* TODO: run these feedback updates in a separate event, like the .output onchange event. */
    printNextTargets()
    scrollIntoView($output)
    timer.manageTimer(initialOutputLength, currentOutputLength, text)
  } else {
    // input is not correct. A wrong input may be treated differently depending on circumstances
    if (currentOutputLength === 0) {
      // timer is not going. Don't give feedback. Don't accept wrong input as the first input.
    } else {
      $output.addClass('wrong').removeClass('correct')

      // print only the wrong character, not the target characters.
      if (settings.typingOptions['allow-wrong-input']) {
        printToOutput(input)
      }
    }
  }

  return isCorrect

  /**
   * Determine whether the existing text + the new input match up with the text.
   * @return {boolean}
   */
  function isInputCorrect () {
    var inputAndTargetMatch
    var effectiveInput
    var effectiveTarget

    if (options['require-capitalization']) {
      effectiveInput = input
      effectiveTarget = target
    } else {
      effectiveInput = input.toLowerCase()
      effectiveTarget = target.toLowerCase()
    }

    inputAndTargetMatch = (effectiveInput === effectiveTarget) ||
      isLineEnding(input, target) ||
      isEquivalent(effectiveInput, effectiveTarget)

    // Everything is correct IF the input itself is correct AND everything before is correct.
    return inputAndTargetMatch && text.substr(0, currentOutputLength) === $output.val() // FIXME there's a var for $output.val()
  }

  function isEquivalent (effectiveInput, effectiveOutput) {
    var equivalent = false
    for (var e of equivalencies) {
      if (e.indexOf(effectiveInput) !== -1 &&
        e.indexOf(effectiveOutput) !== -1) {
        equivalent = true
        break
        // RESEARCH return optimized by v8?
      }
    }
    return equivalent
  }

  /**
   * If a String t is passed, append it to the output. If no string is passed, determine what should be appended
   * from the text.
   * @param t
   */
  function printToOutput (t) {
    $output.val($output.val() + t) // FIXME: what if a selection of text is replaced by the input?
  }

  /**
   * Appends to the output the next target, as well as any succeeding targets depending on typingOptions.
   */
  function printNextTargets () {
    var autoPrintPunctuation = !options['require-punctuation']
    var autoPrintNewline = !options['require-newline']
    do {
      printToOutput(target)
      currentOutputLength++
      target = text[currentOutputLength] // FIXME check for aioob
    } while (target && ((autoPrintPunctuation && isPunctuation(target)) ||
    (autoPrintNewline && isLineEnding(target))))
  }

  /**
   * Takes any number of inputs. Returns true if all of the arguments are Strings starting with a line ending
   * character (\n or \r).
   * @return {boolean}
   */
  function isLineEnding () {
    var isLineEnding = true
    $.each(arguments, function (idx, arg) {
      if (arg.charCodeAt(0) !== 10 && arg.charCodeAt(0) !== 13) {
        isLineEnding = false
        return false // only breaks from the $.each loop
      }
    })
    return isLineEnding
  }

  /**
   * Returns True if the String s is a non-alphanumeric punctuation character.
   * Strings with multiple characters will fail even if they are composed of multiple punctuation characters.
   * @param s
   */
  function isPunctuation (s) {
    return !!s.match(/[^\w\s]|_/g)
  }

  /**
   *
   * @param $el a jQuery object representing a textarea
   */
  function scrollIntoView ($el) {
    $el.stop().animate({scrollTop: $el.get(0).scrollHeight - $el.innerHeight()}, 250, 'easeOutCubic')
  }
}

function keydownHandler (event) {
  if (!timer.isRunning()) {
    return
  }

  var key = event.keyCode || event.which
  if (key === 8 || key === 46) { // backspace or delete
    const $output = $('.output')
    const outputVal = $output.val()
    let textAfterEdit
    let selectionEnd = $output.get(0).selectionEnd
    let selectionStart = $output.get(0).selectionStart
    if (key === 8) {
      // backspace
      if (!event.ctrlKey) {
        textAfterEdit = outputVal.slice(0, Math.max(selectionStart - 1, 0)) + outputVal.slice(selectionEnd)
      } else {
        // backspace the entire last "word"
        const substring = outputVal.slice(0, $output.get(0).selectionStart)
        const cutAtIndex = substring.lastIndexOf(substring.match(/(\b\w+)/g).pop())
        textAfterEdit = substring.slice(0, cutAtIndex)
      }
    } else {
      // delete
      textAfterEdit = outputVal.slice(0, selectionStart) + outputVal.slice(selectionEnd + 1)
      // technically this should also check for control, but probably won't happen.
      // TODO put a logger statement here to let me know if it ever actually happens.
    }
    const match = textObj.text.substr(0, textAfterEdit.length) === textAfterEdit

    if (match) {
      $output.removeClass('wrong').addClass('correct')
    } else {
      $output.removeClass('correct').addClass('wrong')
    }
  }
}

function start (e) {
  e.preventDefault()
  if ($('.text').is(':visible')) {
    domManipulation.hideText()
  } else {
    domManipulation.revealText()
  }
}

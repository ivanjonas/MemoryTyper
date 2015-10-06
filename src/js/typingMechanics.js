/**
 * Created by Yvonne on 2015-07-05.
 */
var app = app || {}
app.typingMechanics1 = {
  textObj: undefined,
  $output: $('.output'),

  /**
   * Should return true if it was a success and false otherwise. TODO it doesn't.
   * @param event
   */
  keyboardInput: function (event) {
    var text
    var target
    var tm = app.typingMechanics1
    var input = String.fromCharCode(event.keyCode)
    var currentOutput = tm.$output.val()
    var currentOutputLength = currentOutput.length
    var initialOutputLength = currentOutputLength
    var options = app.settings.typingOptions

    event.preventDefault() // FIXME: does not prevent paste

    // don't run this handler when there is no text available, or when the text is done.
    text = tm.textObj ? tm.textObj.text : ''
    if (text.length === 0 || text === currentOutput) {
      return
    }
    target = text[currentOutputLength] // FIXME check for aioob

    if (isInputCorrect()) {
      tm.$output.addClass('correct').removeClass('wrong')
      /* TODO: run these feedback updates in a separate event, like the .output onchange event. */
      printNextTargets()
      scrollIntoView(tm.$output)
      app.timer.manageTimer(initialOutputLength, currentOutputLength, text)
    } else {
      // input is not correct. A wrong input may be treated differently depending on circumstances
      if (currentOutputLength === 0) {
        // timer is not going. Don't give feedback. Don't accept wrong input as the first input.
      } else {
        tm.$output.addClass('wrong').removeClass('correct')

        // print only the wrong character, not the target characters.
        if (app.settings.typingOptions['allow-wrong-input']) {
          printToOutput(input)
        }
      }
    }

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
      return inputAndTargetMatch && text.substr(0, currentOutputLength) === tm.$output.val()
    }

    function isEquivalent (effectiveInput, effectiveOutput) {
      var equivalent = false
      tm.equivalencies.every(function (e) {
        if (e.indexOf(effectiveInput) !== -1) {
          if (e.indexOf(effectiveOutput) !== -1) {
            equivalent = true
            // RESEARCH return optimized by v8?
          }
        }
      })
      return equivalent
    }

    /**
     * If a String t is passed, append it to the output. If no string is passed, determine what should be appended
     * from the text.
     * @param t
     */
    function printToOutput (t) {
      tm.$output.val(tm.$output.val() + t) // FIXME: what if a selection of text is replaced by the input?
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
  },

  equivalencies: [
    ['-', '‒', '–', '—', '―', '−'], // the last one is a "minus." http://codepen.io/jonas_ninja/pen/KdNvwK
    ['"', '“', '”'] // quotes are sometimes curly.
  ]
}

app.typingMechanics1.$output
  .on('keypress', app.typingMechanics1.keyboardInput)
  .on('keydown', function (e) { // TODO explore the differences between keypress and keydown
    var key = e.keyCode
    if (key === 8 || key === 46) {
      // console.log("delete or backspace")
    }
  })

app.settings = {
  typingOptions: {
    'allow-wrong-input': false,
    'require-capitalization': true,
    'require-punctuation': true,
    'require-newline': true
  }
}

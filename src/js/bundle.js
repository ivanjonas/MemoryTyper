(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

let textsCrud = require('./textsCrud')
const domManipulation = require('./utils/domManipulation')
let typingMechanics = require('./typingMechanics')
let settings = require('./settings')

// main code
function TextObj (title, text, tags) {
  this.id = getNextAutoIncrement()
  this.text = text
  this.title = title
  // noinspection JSUnusedGlobalSymbols
  this.tags = tags
}
function getNextAutoIncrement () {
  var nextId = parseInt(window.localStorage.getItem('textAutoIncrement') || 1, 10)
  window.localStorage.setItem('textAutoIncrement', nextId + 1)
  return nextId
}

$(function () {
  textsCrud.initLoad()
  $('.text').fixHeight()
  $('.output').focus()

  $(document).on('click', '.go', function (e) {
    e.preventDefault()
    if ($('.text').is(':visible')) {
      domManipulation.hideText()
    } else {
      domManipulation.revealText()
    }
  })

  $(document).on('click', '#text-add .btn-primary', function addNewText (e) {
    var newTextObj = new TextObj($('#text-add-title').val(), $('#text-add-text').val())
    textsCrud.saveText(newTextObj)
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  }).on('click', '#text-edit .btn-primary', function editExistingText (e) {
    var textId = $(e.target).closest('.modal').data('textId')
    textsCrud.editText(textId, $('#text-edit-title').val(), $('#text-edit-text').val())
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  }).on('click', '#text-edit .btn-warning', function deleteExistingText (e) {
    // TODO "are you sure?" Needs custom code for multiple Bootstrap modals
    textsCrud.deleteText($(e.target).closest('.modal').data('textId'))
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  })

  $('#text-edit').on('show.bs.modal', function (event) {
    var modal = $(this)
    var button = $(event.relatedTarget)
    var textId = button.data('textId')
    var textObj = textsCrud.getByTextId(textId)

    modal.find('#text-edit-title').val(textObj.title)
    modal.find('#text-edit-text').val(textObj.text)
    modal.data('textId', textId)
  })

  // $(document).on("change", ".text", function(e) {
  //	text = $(".text").val()
  // }); TODO we want to prevent edits to the text outside a dedicated Edit modal

  typingMechanics.$output
    .on('keypress', typingMechanics.keyboardInput)
    .on('keydown', function (e) { // TODO explore the differences between keypress and keydown
      var key = e.keyCode
      if (key === 8 || key === 46) {
        // console.log("delete or backspace")
      }
    })

  $('input[type=checkbox].option').on('change', function updateOptions () {
    var optionKey = this.id.replace('option-', '')
    settings.typingOptions[optionKey] = this.checked
  })

  $(window).resize(function windowResize () {
    $('.text').fixHeight()
  })
})

},{"./settings":2,"./textsCrud":3,"./typingMechanics":5,"./utils/domManipulation":6}],2:[function(require,module,exports){
/**
 * Created by jonasninja on 10/8/2015.
 */

module.exports = {
  typingOptions: {
    'allow-wrong-input': false,
    'require-capitalization': true,
    'require-punctuation': true,
    'require-newline': true
  }
}
},{}],3:[function(require,module,exports){
'use strict'

let typingMechanics = require('./typingMechanics')
const timer = require('./timer')

module.exports = {
  texts: null,
  loadText: function loadText (textObj) {
    typingMechanics.textObj = textObj
    $('.text').show().val(textObj.text).fixHeight()
    $('.go').removeAttr('disabled').show()

    // remove any existing typing data
    timer.resetTimer()
  },
  /**
   * populate the list with Texts. Runs once on page load.
   */
  initLoad: function initLoad () {
    var userTexts = $('#user-texts').find('ul').empty() // DOM el

    this.texts = JSON.parse(window.localStorage.getItem('texts')) // an array of textObjects

    if (this.texts === undefined) {
      return
    }
    this.texts.forEach(function (el) {
      var li = $('<li><span class="text-title">' + el.title +
        '</span><span class="glyphicon glyphicon-cog text-menu" data-toggle="modal" data-target="#text-edit" data-text-id="' + el.id + '"></span></li>') // TODO use Polymer element here
      li.data('text', el.text)
      li.data('id', el.id)
      userTexts.append(li)
      li.on('click', 'span.text-title', function () {
        module.exports.loadText(el)
      })
    })
  },
  saveText: function saveText (textObj) {
    // do some validation first. Is this textObj already there? if so, update.
    this.texts.push(textObj)
    this.persistTexts()
    module.exports.loadText(textObj)
  },
  editText: function editText (textId, newTitle, newText) {
    var textObj = this.getByTextId(textId)
    var distance = window.Levenshtein.get(textObj.text.toLowerCase(), newText.toLowerCase())

    if (distance > 30) { // an arbitrary number
      // AND there is historical data for this text
      // TODO display warning text saying that historical data may become very inaccurate. Is that even true?
      console.log('Text ' + textObj.id + ' has been changed significantly.')
    }

    textObj.text = newText
    textObj.title = newTitle
    this.persistTexts()

    // update .text if this text is loaded in it
    if (typingMechanics.textObj !== undefined && typingMechanics.textObj.id === textId) {
      $('textarea.text').val(newText)
    }
  },
  deleteText: function deleteText (textId) {
    this.texts = this.texts.filter(function (el) {
      return el.id !== textId
    })
    this.persistTexts()

    // clear .text if this text is loaded in it
    if (typingMechanics.textObj !== undefined && typingMechanics.textObj.id === textId) {
      $('textarea.text').val('')
      $('#text-edit').removeData('textId')
      $('.go').attr('disabled', 'disabled')
    }
  },
  persistTexts: function persistTexts () {
    window.localStorage.setItem('texts', JSON.stringify(this.texts))
  },

  getByTextId: function getByTextId (textId) {
    var textObjArray = this.texts.filter(function filterById (textObj) {
      return textObj.id === textId
    })
    if (textObjArray.length !== 1) {
      console.log('Searched for textId ' + textId + ' but did not find a unique result. Full texts: \n' + this.texts) // TODO replace with a real logging implementation
      throw new Error('Unique result not found')
    }
    return textObjArray[0]
  }
}

},{"./timer":4,"./typingMechanics":5}],4:[function(require,module,exports){
/**
 * Created by Yvonne on 10/6/2015.
 */
'use strict'

const domManipulation = require('./utils/domManipulation')

module.exports = {
  $timerDisplay: $('.timerDisplay'),
  $results: $('.results'),

  /**
   * Starts or stops the timer if appropriate. This means setting the start and end times on the appropriate DOM
   * element.
   */
  manageTimer: function manageTimer (initialOutputLength, currentOutputLength, text) {
    // start the timer
    if (initialOutputLength === 0 && currentOutputLength >= 0) {
      this.$timerDisplay.text('timer running...').data('start', new Date())
    }
    // end the timer
    if (text.length === currentOutputLength) {
      this.endTimer(text)
    }
  },

  endTimer: function endTimer (text) {
    var end = new Date()
    var duration = end - this.$timerDisplay.data('start')
    this.$timerDisplay.text('timer finished.').data('end', end)

    var wordCount = text.split(/\s+/).length
    var wpm = Math.round((wordCount / duration * 100000 * 60)) / 100

    this.$results.text(wordCount + ' words in ' + (duration / 1000) + ' seconds. ' + wpm + ' words per minute.')
  },

  resetTimer: function resetTimer () {
    this.$timerDisplay.removeData('start end').text('timer reset')
    this.$results.text('')
    $('.output').removeClass('correct wrong').val('')
    domManipulation.revealText()
  }
}
},{"./utils/domManipulation":6}],5:[function(require,module,exports){
/**
 * Created by Yvonne on 2015-07-05.
 */
'use strict'

const timer = require('./timer')
let settings = require('./settings')

module.exports = {
  textObj: undefined,
  $output: $('.output'),
  equivalencies: [
    ['-', '‒', '–', '—', '―', '−'], // the last one is a "minus." http://codepen.io/jonas_ninja/pen/KdNvwK
    ['"', '“', '”'] // quotes are sometimes curly.
  ],

  /**
   * Should return true if it was a success and false otherwise. TODO it doesn't.
   * @param event
   */
  keyboardInput: function (event) {
    var text
    var target
    var $output = module.exports.$output
    var textObj = module.exports.textObj
    var input = String.fromCharCode(event.keyCode)
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

    if (isInputCorrect()) {
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
      module.exports.equivalencies.every(function (e) {
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
}

},{"./settings":2,"./timer":4}],6:[function(require,module,exports){
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
},{}]},{},[1]);

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

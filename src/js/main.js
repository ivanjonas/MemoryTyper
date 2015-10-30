'use strict'

let textsCrud = require('./textsCrud')
const domManipulation = require('./utils/domManipulation')
const blurmode = require('./mode-blur')
const wordmode = require('./mode-word')
const timer = require('./timer')
const textObj = require('./textObj')
const semver = require('./utils/semver')
let typingMechanics = require('./typingMechanics')
let settings = require('./settings')

// main code
semver.updateData()
settings.loadUserSettings()
textsCrud.initLoad()
$('.text').fixHeight()
$('.output').focus()

$(document).on('click', 'button.mode-typing', function (e) {
  e.preventDefault()
  if ($('.text').is(':visible')) {
    domManipulation.hideText()
  } else {
    domManipulation.revealText()
  }
}).on('click', 'button.mode-blur', blurmode.start)
  .on('click', '#mode-blur button.blur', blurmode.blur)
  .on('click', '#mode-blur button.back', blurmode.back)
  .on('click', '#mode-blur .blurrable.blurred', blurmode.toggleBlur)

$(document).on('click', 'button.mode-word', wordmode.start)
  .on('click', '#mode-word button.back', blurmode.back) // TODO refactor so using the same code would make sense
  .on('click', '#mode-word button.word', wordmode.revealWord)
  .on('click', '#mode-word button.sentence', wordmode.revealSentence)
  .on('click', '#mode-word button.reset', wordmode.reset)

$(document).on('click', '#text-add .btn-primary', function addNewText (e) {
  let $title = $('#text-add-title')
  let $text = $('#text-add-text')
  var newTextObj = new textObj.TextObj($title.val(), $text.val())
  textsCrud.saveText(newTextObj)
  textsCrud.initLoad()
  $title.val('')
  $text.val('')
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

typingMechanics.$output
  .on('keypress', typingMechanics.keyboardInput)
  .on('keydown', function (e) {
    if (!timer.isRunning()) {
      return
    }

    var key = e.keyCode || e.which
    if (key === 8 || key === 46) { // backspace or delete
      const $output = $('.output')
      const outputVal = $output.val()
      let textAfterEdit
      let selectionEnd = $output.get(0).selectionEnd
      let selectionStart = $output.get(0).selectionStart
      if (key === 8) {
        // backspace
        if (!e.ctrlKey) {
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
      const match = typingMechanics.textObj.text.substr(0, textAfterEdit.length) === textAfterEdit

      if (match) {
        $output.removeClass('wrong').addClass('correct')
      } else {
        $output.removeClass('correct').addClass('wrong')
      }
    }
  })

$('input[type=checkbox].option').on('change', function updateOptions () {
  var optionKey = this.id.replace('option-', '')
  settings.set(optionKey, this.checked)
})

$(window).resize(function windowResize () {
  $('.text').fixHeight()
})

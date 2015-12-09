'use strict'

const textsCrud = require('./textsCrud')
const domManipulation = require('./utils/domManipulation')
const blurmode = require('./mode-blur')
const wordmode = require('./mode-word')
const modals = require('./modals')
const semver = require('./utils/semver')
let typingMechanics = require('./typingMechanics')
let settings = require('./settings')

// main code
semver.updateData()
settings.loadUserSettings()
textsCrud.initLoad()
$('.text').fixHeight()
$('.output').focus()

// interacting with practice modes
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

// loading, adding and editing texts
$(document).on('click', '.text-card', function loadCard (e) {
  textsCrud.loadText(parseInt($(this).data('textId'), 10))
}).on('click', '.text-card .card-menu', function (e) {
  const modal = $('#text-edit').modal()
  const textId = $(this).closest('.text-card').data('textId')
  const textObj = textsCrud.getByTextId(textId)

  modal.find('#text-edit-title').val(textObj.title)
  modal.find('#text-edit-text').val(textObj.text)
  modal.data('textId', textId)

  e.stopPropagation()
}).on('click', '.btn.success', function () {
  const textId = $(this).closest('.text-card').data('textId')
  const textObj = textsCrud.getByTextId(textId)
  textObj.completeReview(true)
  textsCrud.persistTexts()
  textsCrud.initLoad()
  return false
}).on('click', '.btn.failure', function () {
  const textId = $(this).closest('.text-card').data('textId')
  const textObj = textsCrud.getByTextId(textId)
  textObj.completeReview(false)
  textsCrud.persistTexts()
  textsCrud.initLoad()
  return false
}).on('click', '#text-add .btn-primary', modals.addNewText)
  .on('click', '#text-edit .btn-primary', modals.editExistingText)
  .on('click', '#text-edit .btn-warning', modals.deleteExistingText)

// typing mechanics TODO move to typingMechanics where it obviously belongs...
typingMechanics.$output
  .on('keypress', typingMechanics.keypressHandler)
  .on('keydown', typingMechanics.keydownHandler)

$('input[type=checkbox].option').on('change', function updateOptions () {
  var optionKey = this.id.replace('option-', '')
  settings.set(optionKey, this.checked)
})

$(window).resize(function windowResize () {
  $('.text').fixHeight()
})

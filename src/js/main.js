'use strict'

const textsCrud = require('./textsCrud')
const domManipulation = require('./utils/domManipulation')
const blurmode = require('./mode-blur')
const wordmode = require('./mode-word')
const modals = require('./modals')
const semver = require('./utils/semver')
const review = require('./review')
let typingMechanics = require('./typingMechanics')
let settings = require('./settings')

// main code
semver.updateData()
settings.loadUserSettings()
textsCrud.initLoad()
$('.text').fixHeight()
$('.output').focus()

// interacting with practice modes
$(document).on('click', 'button.mode-typing', typingMechanics.start)
  .on('click', 'button.mode-blur', blurmode.start)
  .on('click', '#mode-blur button.blur', blurmode.blur)
  .on('click', '#mode-blur button.back', blurmode.back)
  .on('click', '#mode-blur .blurrable.blurred', blurmode.toggleBlur)

$(document).on('click', 'button.mode-word', wordmode.start)
  .on('click', '#mode-word button.back', blurmode.back) // TODO refactor so using the same code would make sense
  .on('click', '#mode-word button.word', wordmode.revealWord)
  .on('click', '#mode-word button.sentence', wordmode.revealSentence)
  .on('click', '#mode-word button.reset', wordmode.reset)

  // loading, adding and editing texts
  .on('click', '.text-card', textsCrud.loadCardHandler)
  .on('click', '.text-card .card-menu', textsCrud.openCardMenuHandler)

  .on('click', '.btn.success', review.successfulReviewHandler)
  .on('click', '.btn.failure', review.failedReviewHandler)

  .on('click', '#text-add .btn-primary', modals.addNewText)
  .on('click', '#text-edit .btn-primary', modals.editExistingText)
  .on('click', '#text-edit .btn-warning', modals.deleteExistingText)

// typing mechanics TODO move to typingMechanics where it obviously belongs...
typingMechanics.$output
  .on('keypress', typingMechanics.keypressHandler)
  .on('keydown', typingMechanics.keydownHandler)

$('input[type=checkbox].option').on('change', settings.updateOptionsHandler)

$(window).resize(domManipulation.windowResizeHandler)

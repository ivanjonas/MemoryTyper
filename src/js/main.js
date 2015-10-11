'use strict'

let textsCrud = require('./textsCrud')
const domManipulation = require('./utils/domManipulation')
const blurmode = require('./mode-blur')
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
        const $output = $('.output')
        const outputVal = $output.val()
        const match = typingMechanics.textObj.text.substr(0, outputVal.length) === outputVal
        if (match) {
          $output.removeClass('wrong').addClass('correct')
        } else {
          $output.removeClass('correct').addClass('wrong')
        }
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

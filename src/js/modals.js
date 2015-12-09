/**
 * Created by jonasninja on 12/8/2015.
 */
'use strict'

const textsCrud = require('./textsCrud')
const textObj = require('./textObj')

module.exports = {
  addNewText: function addNewText (e) {
    let $title = $('#text-add-title')
    let $text = $('#text-add-text')
    var newTextObj = new textObj.TextObj($title.val(), $text.val())
    textsCrud.saveText(newTextObj)
    textsCrud.initLoad()
    $title.val('')
    $text.val('')
    $(e.target).closest('.modal').modal('hide')
  },

  editExistingText: function editExistingText (e) {
    var textId = $(e.target).closest('.modal').data('textId')
    textsCrud.editText(textId, $('#text-edit-title').val(), $('#text-edit-text').val())
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  },

  deleteExistingText: function deleteExistingText (e) {
    // TODO "are you sure?" Needs custom code for multiple Bootstrap modals
    textsCrud.deleteText($(e.target).closest('.modal').data('textId'))
    textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  }
}

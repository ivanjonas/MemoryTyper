var app = app || {}
// polyfills

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

app.main = {
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

$(function () {
  app.textsCrud.initLoad()
  $('.text').fixHeight()
  $('.output').focus()

  $(document).on('click', '.go', function (e) {
    e.preventDefault()
    if ($('.text').is(':visible')) {
      app.main.hideText()
    } else {
      app.main.revealText()
    }
  })

  $(document).on('click', '#text-add .btn-primary', function addNewText (e) {
    var newTextObj = new TextObj($('#text-add-title').val(), $('#text-add-text').val())
    app.textsCrud.saveText(newTextObj)
    app.textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  }).on('click', '#text-edit .btn-primary', function editExistingText (e) {
    var textId = $(e.target).closest('.modal').data('textId')
    app.textsCrud.editText(textId, $('#text-edit-title').val(), $('#text-edit-text').val())
    app.textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  }).on('click', '#text-edit .btn-warning', function deleteExistingText (e) {
    // TODO "are you sure?" Needs custom code for multiple Bootstrap modals
    app.textsCrud.deleteText($(e.target).closest('.modal').data('textId'))
    app.textsCrud.initLoad()
    $(e.target).closest('.modal').modal('hide')
  })

  $('#text-edit').on('show.bs.modal', function (event) {
    var modal = $(this)
    var button = $(event.relatedTarget)
    var textId = button.data('textId')
    var textObj = app.textsCrud.getByTextId(textId)

    modal.find('#text-edit-title').val(textObj.title)
    modal.find('#text-edit-text').val(textObj.text)
    modal.data('textId', textId)
  })

  // $(document).on("change", ".text", function(e) {
  //	text = $(".text").val()
  // }); TODO we want to prevent edits to the text outside a dedicated Edit modal

  $('input[type=checkbox].option').on('change', function updateOptions () {
    var optionKey = this.id.replace('option-', '')
    app.settings.typingOptions[optionKey] = this.checked
  })

  $(window).resize(function windowResize () {
    $('.text').fixHeight()
  })
})

/**
 * Created by jonasninja on 10/28/2015.
 */
'use strict'

exports.TextObj = TextObj

/**
 * A representation of a text to be memorized. It includes performance and review metadata.
 * @param title An identifying title for this text
 * @param text The body of the text to be memorized
 * @param corrects (optional) Real Number, increases the initial review date as per Review Algorithm 1
 * @constructor
 */
function TextObj (title, text, corrects) {
  this.id = getNextAutoIncrement()
  this.text = text
  this.title = title
  this.reviews = {success: corrects || 0, failure: 0}
}

function getNextAutoIncrement () {
  var nextId = parseInt(window.localStorage.getItem('textAutoIncrement') || 1, 10)
  window.localStorage.setItem('textAutoIncrement', nextId + 1)
  return nextId
}

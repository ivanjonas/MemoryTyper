/**
 * Created by jonasninja on 10/28/2015.
 *
 * Review Algorithm 1:
 *   f(c): 2^(c-1)
 */
'use strict'

exports.TextObj = TextObj

/**
 * A representation of a text to be memorized. It includes performance and review metadata.
 * @param title An identifying title for this text
 * @param text The body of the text to be memorized
 * @param successes (optional) Real Number, increases the initial review date as per Review Algorithm 1
 * @constructor
 */
function TextObj (title, text, successes) {
  this.id = getNextAutoIncrement()
  this.text = text
  this.title = title

  let dueDate = new Date()
  dueDate.setMilliseconds(0)
  dueDate.setSeconds(0)
  dueDate.setMinutes(0)
  dueDate.setHours(0)

  this.reviews = {
    successes: 0,
    continuousSuccesses: successes || 0,
    failures: 0,
    lastResult: null, // 'success' or 'failure'
    lastSuccess: null,
    lastFailure: null,
    dueDate: dueDate.getTime()
  }
}

/**
 * Updates the text metadata to reflect the new date on which it is due for review.
 *
 * This function calculates the next due date based on whether it was just reviewed correctly or incorrectly (as
 * signified by the isCorrect parameter).
 * @param isCorrect whether the just-completed review was a success (recalled correctly) or failure.
 */
TextObj.prototype.generateReviewDate = function generateReviewDate (isCorrect) {
  if (typeof isCorrect !== 'boolean') {
    throw new Error('a proper boolean input is required.')
  }
  if (isCorrect) {
    // review was a success. Increment and set a future date
    this.reviews.successes += 1
    this.reviews.lastSuccess = new Date()
    this.reviews.lastResult = 'success'
    this.reviews.dueDate = getNextDate(this.reviews).getTime()
  } else {
    this.reviews.failures += 1
    this.reviews.lastFailure = new Date()
    this.reviews.lastResult = 'failure'
    this.reviews.dueDate = noTime(new Date()).getTime()
  }
}

function getNextAutoIncrement () {
  var nextId = parseInt(window.localStorage.getItem('textAutoIncrement') || 1, 10)
  window.localStorage.setItem('textAutoIncrement', nextId + 1)
  return nextId
}

function getNextDate (reviews) {
  return addDays(noTime(new Date()), Math.min(Math.pow(2, reviews.successes - 1), 100))
}

function addDays (date, days) {
  date.setDate(date.getDate() + days)
  return date
}

function noTime (date) {
  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(0)
  date.setHours(0)
  return date
}

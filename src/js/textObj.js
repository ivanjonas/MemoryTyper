/**
 * Created by jonasninja on 10/28/2015.
 *
 * Review Algorithm 1:
 *   f(c): 2^(c-1)
 *   * with a maximum of 122 days (about 1/3 of a year)
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
    successes: successes,
    continuousSuccesses: successes || 0,
    failures: 0,
    lastSuccess: null,
    lastFailure: null,
    dueDate: dueDate.getTime()
  }
  if (successes) {
    this.reviews.dueDate = getNextDate(this.reviews)
  }
}

/**
 * Updates the TextObj appropriately based on whether a review was completed successfully or not.
 *
 * @param {boolean} isCorrect - whether the just-completed review was a success or a failure.
 */
TextObj.prototype.completeReview = function completeReview (isCorrect) {
  if (typeof isCorrect !== 'boolean') {
    throw new Error('a proper boolean input is required.')
  }
  if (isCorrect) {
    incrementSuccessCount(this.reviews)
  } else {
    incrementFailCount(this.reviews)
  }
  this.reviews.dueDate = getNextDate(this.reviews).getTime()
}

/**
 * Returns a hypothetical new date on which a text would be due for review, if it were to be reviewed.
 *
 * The next due date is based on whether the review was a success or failure, signified by the isCorrect parameter.
 * @param {boolean} isCorrect - whether the just-completed review was a success (recalled correctly) or failure.
 */
TextObj.prototype.generateReviewDate = function generateReviewDate (isCorrect) {
  if (typeof isCorrect !== 'boolean') {
    throw new Error('a proper boolean input is required.')
  }
  let futureReviewObj = Object.create(this.reviews) // we'll throw away this object at the end of the function
  if (isCorrect) {
    incrementSuccessCount(futureReviewObj)
  } else {
    incrementFailCount(futureReviewObj)
  }
  return getNextDate(futureReviewObj)
}

function incrementSuccessCount (reviewObj) {
  reviewObj.successes++
  reviewObj.continuousSuccesses++
  reviewObj.lastSuccess = new Date().getTime()
}
function incrementFailCount (reviewObj) {
  reviewObj.failures++
  reviewObj.continuousSuccesses = 0
  reviewObj.lastFailure = new Date().getTime()
}

function getNextAutoIncrement () {
  var nextId = parseInt(window.localStorage.getItem('textAutoIncrement') || 1, 10)
  window.localStorage.setItem('textAutoIncrement', nextId + 1)
  return nextId
}

function getNextDate (reviews) {
  let daysForward = reviews.continuousSuccesses
  if (reviews.continuousSuccesses > 2) {
    daysForward = Math.min(Math.pow(2, reviews.successes - 1), 122)
  }
  return addDays(noTime(new Date()), daysForward)
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

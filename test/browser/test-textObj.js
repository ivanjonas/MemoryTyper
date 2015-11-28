/**
 * Created by jonasninja on 10/28/2015.
 */
/* eslint-env browser */
'use strict'

const test = require('tape')
let textObj = require('../../src/js/textObj')

test('creating a new textObj', function newTextObj (t) {
  t.plan(10)

  const today = getToday()
  const body = 'the body of the text'
  const title = 'title'
  let nextIndex = parseInt(window.localStorage.getItem('textAutoIncrement'), 10)
  let obj = new textObj.TextObj(title, body)

  t.equal(obj.title, title)
  t.equal(obj.text, body)
  t.equal(obj.id, nextIndex)

  const r = obj.reviews
  t.ok(basicallyEqual(r.dueDate, today), 'Due date should be beginning of today')
  t.false(r.lastFailure)
  t.false(r.lastResult)
  t.false(r.lastSuccess)
  t.false(r.successes)
  t.false(r.continuousSuccesses)
  t.false(r.failures)
})

test('completing reviews successfully', function getItRight (t) {
  t.plan(6)
  const today = getToday()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const inTwoDays = new Date(today)
  inTwoDays.setDate(today.getDate() + 2)
  const inFourDays = new Date(today)
  inFourDays.setDate(today.getDate() + 4)
  const inEightDays = new Date(today)
  inEightDays.setDate(today.getDate() + 8)

  let obj = new textObj.TextObj('title', 'body')

  t.ok(basicallyEqual(obj.reviews.dueDate, today))

  obj.completeReview(true)
  t.equal(obj.reviews.successes, 1, 'There should be only one success right now')
  t.ok(basicallyEqual(obj.reviews.dueDate, tomorrow), ' ... which generates a due date of tomorrow')

  obj.completeReview(true)
  t.ok(basicallyEqual(obj.reviews.dueDate, inTwoDays))

  obj.completeReview(true)
  t.ok(basicallyEqual(obj.reviews.dueDate, inFourDays))

  obj.completeReview(true)
  t.ok(basicallyEqual(obj.reviews.dueDate, inEightDays))
})

test('generateReviewDate needs correct input', function needsInput (t) {
  t.plan(6)
  let obj = new textObj.TextObj('title', 'body')
  t.throws(obj.generateReviewDate)
  t.throws(function () {
    obj.generateReviewDate(null)
  })
  t.throws(function () {
    obj.generateReviewDate('string')
  })
  t.throws(function () {
    obj.generateReviewDate(5)
  })
  t.throws(function () {
    obj.generateReviewDate(1)
  })
  t.throws(function () {
    obj.generateReviewDate(0)
  })
})

test('upper limit to number of reviews', function (t) {
  t.plan(3)
  const today = getToday()
  const in64days = new Date(today)
  in64days.setDate(today.getDate() + 64)
  const in122days = new Date(today)
  in122days.setDate(today.getDate() + 122)
  const obj = new textObj.TextObj('title', 'body')

  obj.completeReview(true) // will be due tomorrow
  obj.completeReview(true) // will be due in 2 days
  obj.completeReview(true) // ... 4 days
  obj.completeReview(true) // 8
  obj.completeReview(true) // 16
  obj.completeReview(true) // 32
  obj.completeReview(true) // 64
  t.ok(basicallyEqual(obj.reviews.dueDate, in64days), 'should be due at ' + in64days.toISOString() +
    ' but was due on ' + (new Date(obj.reviews.dueDate)).toISOString())

  obj.completeReview(true) // 122
  t.ok(basicallyEqual(obj.reviews.dueDate, in122days), 'should be due at ' + in122days.toISOString() +
    ' but was due on ' + (new Date(obj.reviews.dueDate)).toISOString())

  obj.completeReview(true) // should still be 122
  t.ok(basicallyEqual(obj.reviews.dueDate, in122days), 'should be due at ' + in122days.toISOString() +
    ' but was due on ' + (new Date(obj.reviews.dueDate)).toISOString())
})

test('upper limit to number of reviews', function (t) {
  const today = getToday()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const inTwoDays = new Date(today)
  inTwoDays.setDate(today.getDate() + 2)
  const inFourDays = new Date(today)
  inFourDays.setDate(today.getDate() + 4)
  const inEightDays = new Date(today)
  inEightDays.setDate(today.getDate() + 8)
  const in16Days = new Date(today)
  in16Days.setDate(today.getDate() + 16)
  const in32Days = new Date(today)
  in32Days.setDate(today.getDate() + 32)
  const in64days = new Date(today)
  in64days.setDate(today.getDate() + 64)
  const in122days = new Date(today)
  in122days.setDate(today.getDate() + 122)

  t.test('fail at the beginning', function (t) {
    t.plan(5)
    const obj = new textObj.TextObj('title', 'body')
    obj.completeReview(false)
    t.equal(obj.reviews.failures, 1)
    t.equal(obj.reviews.successes, 0)
    t.ok(basicallyEqual(obj.reviews.dueDate, today))

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, tomorrow))
    t.equal(obj.reviews.failures, obj.reviews.successes)
  })

  t.test(' fail after one success', function (t) {
    t.plan(3)
    const obj = new textObj.TextObj('', '')

    obj.completeReview(true)
    obj.completeReview(false)
    t.ok(basicallyEqual(obj.reviews.dueDate, today), 'should be due today (' + today + 'but was due on ' +
      new Date(obj.reviews.dueDate))

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, tomorrow), 'success after failure, so due tomorrow')

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, inTwoDays), 'should be due in 2 days, but was actually ' +
      new Date(obj.reviews.dueDate))
  })

  t.test(' fail after four successes', function (t) {
    t.plan(5)
    const obj = new textObj.TextObj('', '')

    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    t.ok(basicallyEqual(obj.generateReviewDate(true), in16Days))
    t.equal(obj.reviews.continuousSuccesses, 4)

    obj.completeReview(false)
    t.ok(basicallyEqual(obj.reviews.dueDate, today), 'would have been 32 but is instead tomorrow')

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, tomorrow))

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, inTwoDays), 'and so on')
  })

  t.test(' fail after succeeding twice beyond the highest level', function (t) {
    t.plan(7)
    const obj = new textObj.TextObj('', '')

    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, in122days), "we're at 122 days")
    t.ok(basicallyEqual(obj.generateReviewDate(true), in122days))
    t.ok(basicallyEqual(obj.generateReviewDate(false), today))

    obj.completeReview(false)
    t.ok(basicallyEqual(obj.reviews.dueDate, today))
    t.ok(basicallyEqual(obj.generateReviewDate(true), tomorrow))

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, tomorrow))

    obj.completeReview(true)
    t.ok(basicallyEqual(obj.reviews.dueDate, inTwoDays))
  })
})

function basicallyEqual (date1, date2) {
  // 15 milliseconds should be enough for any test function...
  return Math.abs(date1 - date2) <= 15
}

/**
 * Get a new Date object with all time fields set to 0.
 * @return {Date}
 */
function getToday () {
  const today = new Date()
  today.setMilliseconds(0)
  today.setSeconds(0)
  today.setMinutes(0)
  today.setHours(0)
  return today
}

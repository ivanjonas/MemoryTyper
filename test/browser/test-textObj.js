/**
 * Created by jonasninja on 10/28/2015.
 */
/* eslint-env browser */
'use strict'

const test = require('tape')
let textObj = require('../../src/js/textObj')

test('creating a new textObj', function newTextObj (t) {
  t.plan(10)

  const now = new Date()
  now.setMilliseconds(0)
  now.setSeconds(0)
  now.setMinutes(0)
  now.setHours(0)
  const body = 'the body of the text'
  const title = 'title'
  let nextIndex = parseInt(window.localStorage.getItem('textAutoIncrement'), 10)
  let obj = new textObj.TextObj(title, body)

  t.equal(obj.title, title)
  t.equal(obj.text, body)
  t.equal(obj.id, nextIndex)

  const r = obj.reviews
  t.ok(basicallyEqual(r.due, now), 'Due date should be beginning of today')
  t.false(r.lastFailure)
  t.false(r.lastResult)
  t.false(r.lastSuccess)
  t.false(r.successes)
  t.false(r.continuousSuccesses)
  t.false(r.failures)
})

test('getting correct reviews a few times', function getItRight (t) {
  t.plan(5)
  const now = new Date()
  now.setMilliseconds(0)
  now.setSeconds(0)
  now.setMinutes(0)
  now.setHours(0)
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const inTwoDays = new Date(now)
  inTwoDays.setDate(now.getDate() + 2)
  const inFourDays = new Date(now)
  inFourDays.setDate(now.getDate() + 4)
  const inEightDays = new Date(now)
  inEightDays.setDate(now.getDate() + 8)

  let obj = new textObj.TextObj('title', 'body')

  t.ok(basicallyEqual(obj.reviews.due, now))
  obj.generateReviewDate(true)
  t.ok(basicallyEqual(obj.reviews.due, tomorrow))
  obj.generateReviewDate(true)
  t.ok(basicallyEqual(obj.reviews.due, inTwoDays))
  obj.generateReviewDate(true)
  t.ok(basicallyEqual(obj.reviews.due, inFourDays))
  obj.generateReviewDate(true)
  t.ok(basicallyEqual(obj.reviews.due, inEightDays))
})

test('generateReviewDate needs correct input', function needsInput (t) {
  t.plan(3)
  let obj = new textObj.TextObj('title', 'body')
  t.throws(obj.generateReviewDate)
  t.throws(function () {
    obj.generateReviewDate(null)
  })
  t.throws(function () {
    obj.generateReviewDate('string')
  })
})

function basicallyEqual (date1, date2) {
  // 15 milliseconds should be enough for any test function...
  return Math.abs(date1.getTime() - date2.getTime()) <= 15
}

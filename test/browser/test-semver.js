/**
 * Created by jonasninja on 10/26/2015.
 */

const test = require('tape')
const semver = require('../../src/js/utils/semver.js')
const currVer = '1.2.4' // The version in package.json

test('semver--correctly parses non-value', function parseNonvalue (t) {
  t.plan(6)

  t.throws(function () {
    semver.isGreater('2.a.b', currVer)
  }, Error, 'should throw an error on bad input')
  t.throws(function () {
    semver.isGreater('2.2.', currVer)
  }, Error, 'should throw an error on bad input')
  t.throws(function () {
    semver.isGreater('2.2', currVer)
  }, Error, 'should throw an error on bad input')
  t.throws(function () {
    semver.isGreater('2..b', currVer)
  }, Error, 'should throw an error on bad input')
  t.throws(function () {
    semver.isGreater('.2.2', currVer)
  }, Error, 'should throw an error on bad input')
  t.throws(function () {
    semver.isGreater('2.a.b.c', currVer)
  }, Error, 'should throw an error on bad input')
})

test('semver--any number is greater than no number', function noVersion (t) {
  t.plan(2)

  t.assert(semver.isGreater('0.0.0', null))
  t.assert(semver.isGreater('0.5.1', null))
})

test('semver--GreaterThan works correctly', function greaterThan (t) {
  t.plan(7)

  t.true(semver.isGreater('2.2.4', currVer))
  t.true(semver.isGreater('1.3.4', currVer))
  t.true(semver.isGreater('1.2.5', currVer))
  t.false(semver.isGreater(currVer, currVer))
  t.false(semver.isGreater('0.5.5', currVer))
  t.false(semver.isGreater('1.1.5', currVer))
  t.false(semver.isGreater('1.2.3', currVer))
})

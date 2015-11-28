/**
 * Created by jonasninja on 10/8/2015.
 * Test class for the custom tokenizer
 */

const test = require('tape')
const jsRoot = '../src/js'
const tokenizer = require(jsRoot + '/utils/tokenizer.js')

test('tokenizer--basic tests', function timingTest (t) {
  t.plan(1)

  const text1 = 'There is therefore now no condemnation'
  const output1 = tokenizer.parse(text1)
  const expected1 = [
    {
      word: 'There',
      pos: 0
    }, {
      word: 'is',
      pos: 6
    }, {
      word: 'therefore',
      pos: 9
    }, {
      word: 'now',
      pos: 19
    }, {
      word: 'no',
      pos: 23
    }, {
      word: 'condemnation',
      pos: 26
    }
  ]

  t.deepEqual(output1, expected1, 'Simple string should parse correctly')
})

test('tokenizer--Messy whitespace and punctuation', function (t) {
  t.plan(7)

  const text = "I'm all  kinds,. of (messed) !!UP!!  "
  const output = tokenizer.parse(text)
  const expected = [
    {
      word: "I'm",
      pos: 0
    }, {
      word: 'all',
      pos: 4
    }, {
      word: 'kinds',
      pos: 9
    }, {
      word: 'of',
      pos: 17
    }, {
      word: 'messed',
      pos: 21
    }, {
      word: 'UP',
      pos: 31
    }
  ]

  t.deepEqual(output, expected, "Punctuation shouldn't matter, but should correctly affect word position")
  t.equal(output[0].pos, text.indexOf("I'm"))
  t.equal(output[1].pos, text.indexOf('all'))
  t.equal(output[2].pos, text.indexOf('kinds'))
  t.equal(output[3].pos, text.indexOf('of'))
  t.equal(output[4].pos, text.indexOf('messed'))
  t.equal(output[5].pos, text.indexOf('UP'))
})

test('tokenizer--dashes are a pain', function (t) {
  t.plan(3)

  const text = 'hyphenated-words no not--absolutely--agree with us'
  const output = tokenizer.parse(text)

  t.equal(output[0].word, 'hyphenated-words')
  t.equal(output[3].word, 'absolutely')
  t.equal(output[4].pos, text.indexOf('agree'))
})

// known to fail: 'twas
// it should be a whole word
// but the initial apostrophe is excluded
// very rare case. I SHOULDN'T care, although I want to care.

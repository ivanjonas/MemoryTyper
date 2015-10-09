/**
 * Created by jonasninja on 10/8/2015.
 * Produces an array of metadata objects given an input string
 */

'use strict'

exports.test = function () {
  return 'It works!'
}

/**
 * Given a String, returns an array of objects. Each object represents metadata about each word in the input. An input
 * with 5 words (as "words" are defined by this tokenizer) would return an array of five elements.
 *
 * Each object contains two distinct elements: the word itself and its starting position in the original input.
 *
 * @param text
 */
exports.parse = function parseText (text) {
  const tokens = text.match(/[\w]+(\-[\w]+)?('\w+)?/g)
  let pos = 0
  return tokens.map(function (e) {
    pos = text.indexOf(e, pos)
    let obj = {word: e, pos: pos}
    pos += e.length + 1 // at least one
    return obj
  })
}

/**
 * Created by jonasninja on 12/8/2015.
 */
'use strict'

const textsCrud = require('./textsCrud')

module.exports.successfulReviewHandler = function () {
  const textId = $(this).closest('.text-card').data('textId')
  const textObj = textsCrud.getByTextId(textId)
  textObj.completeReview(true)
  textsCrud.persistTexts()
  textsCrud.initLoad()
  return false
}

module.exports.failedReviewHandler = function () {
  const textId = $(this).closest('.text-card').data('textId')
  const textObj = textsCrud.getByTextId(textId)
  textObj.completeReview(false)
  textsCrud.persistTexts()
  textsCrud.initLoad()
  return false
}

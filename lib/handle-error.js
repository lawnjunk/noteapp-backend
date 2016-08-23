'use strict'

const createError = require('http-errors')
const debug = require('debug')('note:handle-error')

module.exports = function handleError(err, req, res, next){
  debug('handleError')
  console.error(err.message)
  if (err.status && err.name){
    res.status(err.status).send(err.name)
    return next()
  }

  if (err.name === 'ValidationError') {
    err = createError(400, err.message)
    res.status(err.status).send(err.name)
  }

  err = createError(500, err.message)
  res.status(err.status).send(err.name)
}

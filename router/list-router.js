'use strict'

// node modules
// npm modules
const Router = require('express').Router
const createError = require('http-errors')
const jsonParser = require('body-parser').json()
const debug = require('debug')('note:list-router')

// app modules
const List = require('../model/list')
const Note = require('../model/note')

//module constants
let listRouter = module.exports = exports = new Router()

// module logic
listRouter.post('/list', jsonParser, function(req, res, next){
  debug('POST /api/list')
  if (!req.body.name )
    return next(createError(400, 'ERROR: list requires name field'))
  new List(req.body).save().then( list => {
    res.json(list)
  }).catch(next)
})

listRouter.get('/list', function(req,res,next){
  debug('GET /api/list/')
  List.find({})
  .populate('notes')
  .then( lists => res.send(lists)).catch(next)
})

listRouter.get('/list/:id', function(req,res,next){
  debug('GET /api/list/:id')
  List.findOne({_id: req.params.id})
  .populate('notes')
  .then( list => res.send(list))
  .catch( err => next(createError(404, err.message)))
})

listRouter.put('/list/:id', jsonParser, function(req, res, next){
  debug('PUT /api/list/:id')
  List.findByIdAndUpdate( req.params.id, req.body, {new: true})
  .then( list => res.send(list))
  .catch(next)
})

listRouter.delete('/list/:id', jsonParser, function(req, res, next){
  debug('PUT /api/list/:id')
  List.findByIdAndRemove(req.params.id)
  .then( list => {
    return Note.remove({listId: list._id})
  })
  .then(() => {
    res.status(204).send()
  })
  .catch(next)
})

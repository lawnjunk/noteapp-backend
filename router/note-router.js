'use strict';

// node modules
// npm modules
const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('note:note-router');

// app modules
const Note = require('../model/note');

//module constants
let noteRouter = module.exports = exports = new Router();

// module logic
noteRouter.post('/note', jsonParser, function(req, res, next){
  debug('POST /api/note');
  let data = req.body;
  if (!data.name || !data.listId || !data.content) 
    return next(createError(400, 'ERROR: validation error');
  new Note(data).save().then( note => res.json(note)).catch(next)
})

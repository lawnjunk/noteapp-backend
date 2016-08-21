'use strict';

// npm modules
const Router = require('express').Router;
const debug = require('debug')('authdemo:auth-rotuer');
const jsonParser = require('body-parser').json();
const parseBasicAuth = require('../lib/parse-basic-auth');
const User = require('../model/user');


// module constants
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next){
  var user = new User(req.body);
  user.generateHash(req.body.password) // first hash there password
  .then( user => user.save())  // save the user to make sure unique username
  .then( user => user.geterateToken()) // create token to send to the user
  .then( token => res.send(token)) // resolve token
  .catch(next) // reject any error
});

authRouter.get('/signin', parseBasicAuth ,function(req, res, next){
  User.findOne({username: req.auth.username})
  .then( user => user.compareHash(req.auth.password))
  .then( user => user.geterateToken())
  .then( token => res.send(token))
  .catch(next)
});

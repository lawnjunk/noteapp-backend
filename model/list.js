'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('note:list');

Promise.promisifyAll(mongoose);

const listSchema = mongoose.Schema({
  name: {type: String, required: true},
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
});

module.exports = mongoose.model('List', listSchema);

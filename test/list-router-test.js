'use strict';

// setup env vars
process.env.MONGODB_URI = 'mongodb://localhost/notetest';

// npm modules
const request = require('superagent-use');
const superPromse = require('superagent-promise-plugin');
const expect = require('chai').expect;

// app modules
const List = require('../model/list');
const Note = require('../model/note');
require('../server');

request.use(superPromse);

describe('testing list routes', function(){
  describe('testing POST /api/list', function(){
    after((done) => {
      List.remove({}).then( () => done()).catch(done);
    });

    it('should return a note', (done) => {
      request.post('localhost:3000/api/list')
        .send({ name: 'groceries' })
      .then( res => {
        let data = res.body;
        expect(data.name).to.eql('groceries');
        done();
      })
      .catch(done)
    })
  });

  describe('testing GET /api/list', function(){
    before((done) => {
      Promise.all([
        new List({name: 'first list'}).save(),
        new List({name: 'second list'}).save(),
      ]).then(() => done()).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done);
    });

    it('should return a note', (done) => {
      request.get('localhost:3000/api/list')
      .then( res => {
        let data = res.body;
        expect(data.length).to.eql(2);
        expect(data[0].name).to.eql('first list');
        expect(data[1].name).to.eql('second list');
        done();
      })
      .catch(done)
    })
  });

  describe('testing GET /api/list/:id', function(){
    before((done) => {
      new List({name: 'example list'}).save()
        .then( list => {
          new Note({
            name: 'second note',
            content: 'test data',
            listId: list._id,
          }).save()
          .then( note => {
            list.notes.push(note._id);
            return list.save()
            .then(list => {
              this.tempList = list;
              done();
            }).catch(done)
          }).catch(done)
        }).catch(done)
    });

    after((done) => {
      List.remove({}).then( () => done()).catch(done);
    });

    it('should return a note', (done) => {
      request.get(`localhost:3000/api/list/${this.tempList._id}`)
      .then( res => {
        let data = res.body;
        expect(data.name).to.eql('example list');
        console.log('list:id', data)
        done();
      })
      .catch(done)
    })
  });

  describe('testing PUT /api/list/:id', function(){
    before((done) => {
      new List({name: 'example list'}).save()
      .then((list) => {
        this.tempList = list;
        done();
      }).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done);
    });

    it('should return a note', (done) => {
      request.put(`localhost:3000/api/list/${this.tempList._id}`)
        .send({
          name: 'todo list',
        })
      .then( res => {
        let data = res.body;
        expect(data.name).to.eql('todo list');
        done();
      })
      .catch(done)
    })
  });

  describe('testing DELETE /api/list/:id', function(){
    before((done) => {
      new List({name: 'example list'}).save()
      .then((list) => {
        this.tempList = list;
        done();
      }).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done);
    });

    it('should return a note', (done) => {
      request.del(`localhost:3000/api/list/${this.tempList._id}`)
      .then( res => {
        let data = res.body;
        expect(data.name).to.eql('example list');
        done();
      })
      .catch(done)
    })
  });
})

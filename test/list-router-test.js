'use strict'

// setup env vars
process.env.MONGODB_URI = 'mongodb://localhost/notetest'
process.env.APP_SECRET = 'top_secret'

// npm modules
const request = require('superagent-use')
const superPromse = require('superagent-promise-plugin')
const expect = require('chai').expect
const Promise = require('bluebird')

// app modules
const List = require('../model/list')
const Note = require('../model/note')
const User = require('../model/user')
require('../server')

request.use(superPromse)

function createUser(){
  var user = new User({username: 'exam'})
  return user.generateHash('password') // first hash there password
  .then( user => user.save())  // save the user to make sure unique username
  .then( user => Promise.reslove(user))
  .catch(err => Promise.reject(err)) // reject any error
}

function createList(){
  createUser()
  .then( user  => {
    return new List({name: 'example list ', userId: user._id}).save()
  })
  .catch(err => Promise.reject(err))
}


describe('testing list routes', () => {
  before((done) => {
    createUser()
    .then( user => user.generateToken())
    .then( token => this.token = token)
    .then( () => done() )
    .catch()
  })

  after((done) => {
    User.remove({})
    .then(() => done())
    .catch(done)
  })

  describe('testing POST /api/list', () =>{
    after((done) => {
      List.remove({}).then( () => done()).catch(done)
    })

    it('should return a note', (done) => {
      request.post('localhost:3000/api/list')
      .set('Authorization', `Bearer ${this.token}`)
      .send({ name: 'groceries' })
      .then( res => {
        let data = res.body
        expect(data.name).to.eql('groceries')
        done()
      })
      .catch(done)
    })
  })

  describe('testing GET /api/list', () => {
    before((done) => {
      Promise.all([
        new List({name: 'first list'}).save(),
        new List({name: 'second list'}).save(),
      ]).then(() => done()).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done)
    })

    it('should return a note', (done) => {
      request.get('localhost:3000/api/list')
      .then( res => {
        let data = res.body
        expect(data.length).to.eql(2)
        expect(data[0].name).to.eql('first list')
        expect(data[1].name).to.eql('second list')
        done()
      })
      .catch(done)
    })
  })

  describe('testing GET /api/list/:id', () => {
    before((done) => {
      new List({name: 'example list'}).save()
      .then( list => {
        this.tempList = list
        return this.tempList.addNote({
          name: 'first note',
          content: 'test data',
          listId: this.tempList._id,
        })
      }).then(() => {
        return this.tempList.addNote({
          name: 'second note',
          content: 'test data',
          listId: this.tempList._id,
        })
      })
      .then(() => done())
      .catch(done)
    })

    after((done) => {
      Promise.all([
        List.remove({}),
        Note.remove({}),
      ])
      .then( () => done()).catch(done)
    })

    it('should return a note', (done) => {
      request.get(`localhost:3000/api/list/${this.tempList._id}`)
      .then( res => {
        let data = res.body
        expect(data.name).to.eql('example list')
        expect(data.notes[0].name).to.eql('first note')
        expect(data.notes[1].name).to.eql('second note')
        done()
      })
      .catch(done)
    })
  })

  describe('testing PUT /api/list/:id', () => {
    before((done) => {
      new List({name: 'example list'}).save()
      .then((list) => {
        this.tempList = list
        done()
      }).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done)
    })

    it('should return a note', (done) => {
      request.put(`localhost:3000/api/list/${this.tempList._id}`)
      .send({
        name: 'todo list',
      })
      .then( res => {
        let data = res.body
        expect(data.name).to.eql('todo list')
        done()
      })
      .catch(done)
    })
  })

  describe('testing DELETE /api/list/:id', () => {
    before((done) => {
      new List({name: 'example list'}).save()
      .then((list) => {
        this.tempList = list
        done()
      }).catch(done)
    })

    after((done) => {
      List.remove({}).then( () => done()).catch(done)
    })

    it('should return a note', (done) => {
      request.del(`localhost:3000/api/list/${this.tempList._id}`)
      .then( res => {
        expect(res.status).to.eql(204)
        done()
      })
      .catch(done)
    })
  })
})

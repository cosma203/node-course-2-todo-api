const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('./../server');
const Todo = require('./../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

beforeEach(function(done) {
  Todo.remove({})
    .then(function() {
      Todo.insertMany(todos).then(function() {
        done();
      });
    })
    .catch(function(err) {
      done(err.message);
    });
});

describe('POST /todos', function() {
  it('should create a new todo', function(done) {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text: text })
      .expect(200)
      .expect(function(res) {
        expect(res.body.text).toBe(text);
      })
      .end(function(err, res) {
        if (err) {
          return done(err.message);
        }

        Todo.find({ text: text })
          .then(function(todos) {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(function(err) {
            done(err.message);
          });
      });
  });

  it('Should not create todo with invalid body data', function(done) {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err.message);
        }
        Todo.find()
          .then(function(todos) {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(function(err) {
            done(err.message);
          });
      });
  });
});

describe('GET /todos', function() {
  it('should get all todos', function(done) {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(function(res) {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('Get /todos/:id', function() {
  it('should return todo doc', function(done) {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(function(res) {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', function(done) {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', function(done) {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

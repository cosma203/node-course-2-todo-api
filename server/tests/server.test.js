const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('./../server');
const Todo = require('./../models/todo');
const User = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /todos:id', function() {
  it('should remove a todo', function(done) {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(function(res) {
        expect(res.body._id).toBe(hexId);
      })
      .end(function(err, res) {
        if (err) {
          return done(err.message);
        }

        Todo.findById(hexId)
          .then(function(todo) {
            expect(todo).toNotExist();
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
  });

  it('should return 404 if todo not found', function(done) {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', function(done) {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', function() {
  it('should updated todo', function(done) {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: true, text: text })
      .expect(200)
      .expect(function(res) {
        expect(res.body.text).toBe(text);
        expect(res.body.completed).toBe(true);
        expect(res.body.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', function(done) {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: false, text: text })
      .expect(200)
      .expect(function(res) {
        expect(res.body.text).toBe(text);
        expect(res.body.completed).toBe(false);
        expect(res.body.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', function() {
  it('should return user if authenticated', function(done) {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(function(res) {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', function(done) {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(function(res) {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', function() {
  it('should create a user', function(done) {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(function(res) {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(function(err) {
        if (err) {
          return done(err.message);
        }

        User.findOne({ email })
          .then(function(user) {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
  });

  it('should return validation error if request invalid', function(done) {
    request(app)
      .post('/users')
      .send({ email: 'and', password: '123' })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', function(done) {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'Password123!' })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', function() {
  it('should login user and return auth token', function(done) {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(function(res) {
        expect(res.headers['x-auth']).toExist();
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id)
          .then(function(user) {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
  });

  it('should reject invalid login', function(done) {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password + '1' })
      .expect(400)
      .expect(function(res) {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id)
          .then(function(user) {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(function(err) {
            done(err);
          });
      });
  });
});

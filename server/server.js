require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const mongoose = require('./db/mongoose');
const User = require('./models/user');
const Todo = require('./models/todo');
const authenticate = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

// --Middleware--

app.use(bodyParser.json());

// --Routes--

app.post('/todos', authenticate, function(req, res) {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo
    .save()
    .then(function(doc) {
      res.status(200).send(doc);
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

app.post('/users', function(req, res) {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user
    .save()
    .then(function() {
      return user.generateAuthToken();
    })
    .then(function(token) {
      res.header('x-auth', token).send(user);
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get('/todos', authenticate, function(req, res) {
  Todo.find({ _creator: req.user._id })
    .then(function(todos) {
      res.status(200).send({ todos });
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

app.get('/todos/:id', authenticate, function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    Todo.findOne({
      _id: req.params.id,
      _creator: req.user._id
    })
      .then(function(todo) {
        if (!todo) {
          res.status(404).send('User not found');
        }
        res.send(todo);
      })
      .catch(function(err) {
        res.send(err.message);
      });
  } else {
    return res.status(404).send('Invalid Id');
  }
});

app.get('/users/me', authenticate, function(req, res) {
  res.send(req.user);
});

app.delete('/todos/:id', authenticate, function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    Todo.findOneAndRemove({ _id: req.params.id, _creator: req.user._id })
      .then(function(todo) {
        if (!todo) {
          res.status(404).send('User not found');
        }
        res.send(todo);
      })
      .catch(function(err) {
        res.send(err.message);
      });
  } else {
    return res.status(404).send('invalid Id');
  }
});

app.delete('/users/me/token', authenticate, function(req, res) {
  req.user.removeToken(req.token).then(
    function() {
      res.status(200).send('Token removed!');
    },
    function() {
      res.status(400).send();
    }
  );
});

app.patch('/todos/:id', authenticate, function(req, res) {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('invalid Id');
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: id, _creator: req.user.id }, { $set: body }, { new: true })
    .then(function(todo) {
      if (!todo) {
        res.status(404).send('User not found');
      }

      res.send(todo);
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});

module.exports = app;

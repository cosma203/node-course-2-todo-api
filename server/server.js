const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const mongoose = require('./db/mongoose');
const User = require('./models/user');
const Todo = require('./models/todo');

const app = express();
const port = process.env.PORT || 3000;

// --Middleware--

app.use(bodyParser.json());

// --Routes--

app.post('/todos', function(req, res) {
  var todo = new Todo({
    text: req.body.text
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

app.get('/todos', function(req, res) {
  Todo.find({})
    .then(function(todos) {
      res.status(200).send({ todos });
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

app.get('/todos/:id', function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    Todo.findById(req.params.id)
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

app.delete('/todos/:id', function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    Todo.findByIdAndRemove(req.params.id)
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

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});

module.exports = app;

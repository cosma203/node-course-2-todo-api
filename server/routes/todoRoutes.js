const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Todo = require('./../models/todo');
const authenticate = require('./../middleware/authenticate');

router.post('/', authenticate, async function(req, res) {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  try {
    const doc = await todo.save();
    res.status(200).send(doc);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/', authenticate, async function(req, res) {
  try {
    const todos = await Todo.find({ _creator: req.user._id }).select({ text: 1, completed: 1, completedAt: 1 });
    res.status(200).send({ todos });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:id', authenticate, async function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    try {
      const todo = await Todo.findOne({ _id: req.params.id, _creator: req.user._id });
      if (!todo) {
        res.status(404).send('User not found');
      }
      res.send(todo);
    } catch (err) {
      res.status(404).send(err.message);
    }
  } else {
    return res.status(404).send('Invalid Id');
  }
});

router.delete('/:id', authenticate, async function(req, res) {
  if (ObjectID.isValid(req.params.id)) {
    try {
      const todo = await Todo.findOneAndRemove({ _id: req.params.id, _creator: req.user._id });
      if (!todo) {
        res.status(404).send('User not found');
      }
      res.send(todo);
    } catch (err) {
      res.send(err.message);
    }
  } else {
    return res.status(404).send('invalid Id');
  }
});

router.patch('/:id', authenticate, async function(req, res) {
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

  try {
    const todo = await Todo.findOneAndUpdate({ _id: id, _creator: req.user.id }, { $set: body }, { new: true });
    if (!todo) {
      res.status(404).send('User not found');
    }

    res.send(todo);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

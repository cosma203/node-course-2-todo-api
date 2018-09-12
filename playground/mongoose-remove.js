const { ObjectID } = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

/* Todo.remove({}).then(function(result) {
  console.log(result.result);
}); */

// Todo.findOneAndRemove
Todo.findOneAndRemove({_id: '5b98ff8ae85789727030eab6'}).then(function (todo) {
  console.log(todo);
})

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5b98ff8ae85789727030eab6').then(function(todo) {
  console.log(todo);
});

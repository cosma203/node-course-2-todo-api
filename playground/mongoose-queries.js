const { ObjectID } = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

/* var id = '5b97b0341b6cb4bc123884b7';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
} */

// --find--

/* Todo.find({
  _id: id
})
  .then(function(todos) {
    console.log('Todos', todos);
  })
  .catch(function(err) {
    console.log(err.message);
  }); */

// --findOne--

/* Todo.findOne({
  _id: id
})
  .then(function(todo) {
    console.log('Todo', todo);
  })
  .catch(function(err) {
    console.log(err.message);
  }); */

// --findById--

/* Todo.findById(id)
  .then(function(todo) {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log('Todo by Id', todo);
  })
  .catch(function(err) {
    console.log(err.message);
  });
 */

var id = '5b9790139e937d1002014af7';

User.findById(id)
  .then(function(user) {
    if (!user) {
      return console.log('Id not found');
    }
    console.log('User by Id', user);
  })
  .catch(function(err) {
    console.log(err.message);
  });

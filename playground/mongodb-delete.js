// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost/TodoApp',
  function(err, client) {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const todosCollection = client.db('TodoApp').collection('Todos');
    const usersCollection = client.db('TodoApp').collection('Users');

    // --Todos

    // deleteMany
    /* todosCollection.deleteMany({text: 'Eat lunch'}).then(function (result) {
      console.log(result.result);
    }); */

    // deleteOne
    /* todosCollection.deleteOne({text: 'Eat lunch'}).then(function (result) {
      console.log(result.result);
    }) */

    // findOneAndDelete
    /* todosCollection.findOneAndDelete({completed: false}).then(function (result) {
      console.log(result);
    }); */

    // --Users

    // deleteMany
    /* usersCollection.deleteMany({ name: 'Milos' }).then(function(result) {
      console.log(result.result);
    }); */

    // findOneAndDelete
    /* usersCollection.findOneAndDelete({ _id: new ObjectID('5b964b7d0e8c57178cee97da') }).then(function(result) {
      console.log(result.value);
    }); */

    // client.close();
  }
);

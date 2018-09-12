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

    /* todosCollection.insertOne({ text: 'Something to do', completed: false }, function(err, result) {
      if (err) {
        return console.log('Unable to insert todo', err.message);
      }

      console.log(JSON.stringify(result.ops, undefined, 2));
    }); */

    /* usersCollection.insertOne({ name: 'Milos', age: 27, location: 'China' }, function(err, result) {
      if (err) {
        return console.log('Unable to insert user', err.message);
      }

      console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    }); */

    client.close();
  }
);

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

    // --Todos--

    // findOneAndUpdate
    /* todosCollection
      .findOneAndUpdate(
        {
          _id: new ObjectID('5b9662d66e6ef08084166b83')
        },
        {
          $set: {
            completed: true
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(function(result) {
        console.log(result.value);
      }); */

    // --Users--

    //findOneAndUpdate
    /* usersCollection
      .findOneAndUpdate(
        {
          _id: new ObjectID('5b9649b001f8eb1348c46545')
        },
        {
          $inc: {
            age: -1
          },
          $set: {
            name: 'Milos'
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(function(result) {
        console.log(result.value);
      }); */

    // client.close();
  }
);

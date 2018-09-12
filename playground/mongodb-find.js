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

    /* todosCollection
      .find({ _id: new ObjectID('5b965a596e6ef08084166a79') })
      .toArray()
      .then(function(docs) {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
      })
      .catch(function(err) {
        if (err) {
          console.log(err.message);
        }
      }); */

    /* todosCollection
      .find()
      .count()
      .then(function(count) {
        console.log(`Todos count: ${count}`);
      })
      .catch(function(err) {
        if (err) {
          console.log(err.message);
        }
      }); */

    usersCollection
      .find({ name: 'Mike' })
      .toArray()
      .then(function(docs) {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
      })
      .catch(err);

    // client.close();
  }
);

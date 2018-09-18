require('./config/config');
require('./db/mongoose');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/todos', todoRouter);

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});

module.exports = app;

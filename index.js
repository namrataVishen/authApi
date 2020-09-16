require('./config/config');
// require('dotenv').config()
require('./connections/mongo_connect');
require('./config/passportConfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const authRoute = require('./routes/auth.route');

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', authRoute);

// error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    var valErrors = [];
    Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
    res.status(422).send(valErrors)
  }
  else{
    console.log(err);
  }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));

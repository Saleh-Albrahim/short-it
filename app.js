const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
require('dotenv').config();
require('colors');


const app = express();

connectDB();

app.use(morgan('dev'));
//app.use(helmet());
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/', require('./routes/mainRoute'));

// Handle all the errors
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`.yellow.bold);
});


module.exports = app;

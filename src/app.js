const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./auth/passport');

const app = express();

// socket
const server = require('http').createServer(app);

const middlewares = require('./middlewares');
const api = require('./api');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);
// app.use('/api/v1', socketRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// socket connection
// io.on('connection', (socket) => {
//   console.log(socket.id);
// });

// module.exports = app;
module.exports = server;

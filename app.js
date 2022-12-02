const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { usersRouter, weighingsRouter, constantsRouter } = require('./routes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/constants', constantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/weighings', weighingsRouter);

app.use('/', express.static('./public'));
app.use((_, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(`App error handler: [${err.name}] - ${err.message}`);

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    details: { name: err.name, message: err.message, status: err.status },
  });
});

module.exports = { app };

require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const boom = require('@hapi/boom');
const helmet = require('helmet');
const _ = require('lodash');
const config = require('./config');
const logger = require('./config/winston');
const { name } = require('../package.json');
const { handleValidationError, handleCustomErrors } = require('./utils/handleErrors');

const app = express();

// Monit server /status https://www.npmjs.com/package/express-status-monitor
// eslint-disable-next-line import/order
const expressStatusMonitor = require('express-status-monitor');

const statusMonit = {
  title: 'Status server',
};
app.use(expressStatusMonitor(statusMonit));
// @see check healt endpoint, view info in https://www.npmjs.com/package/express-status-monitor

app.use(require('morgan')('combined', { stream: logger.stream }));

// Process ping
app.get('/ping', async (req, res) =>
  res.send({
    status: 'pong',
    name,
    uptime: process.uptime(),
    // db: sequelize.authenticate(),
    // cache: redisClient.connected
  })); // eslint-disable-line

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(helmet());

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

require('./features/api/api.router')(app, passport);

app.listen(config.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info(`Running at port ${config.port}`);
});

app.use(handleValidationError);
app.use(handleCustomErrors);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const error = err.isBoom ? err : boom.badImplementation();
  const { output } = error;

  const statusCode = _.get(output, 'payload.statusCode', 500);
  if (!res._headerSent) {
    return res.status(statusCode || 500).json({
      statusCode,
      message: _.get(output, 'payload.message', 'api.error.internal_error'),
    });
  }
});

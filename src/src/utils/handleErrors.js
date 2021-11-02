const boom = require('@hapi/boom');
const { ValidationError } = require('express-validation');
const logger = require('../config/winston');

const logError = (err) => {
  logger.error(err.toString());
};

// Handle Joi errors
const handleValidationError = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    logger.error(`${err}`);

    return res.status(err.status || 422).json({
      statusCode: err.status || 422,
      message: err.statusText,
      errors: err.details,
    });
  }

  return next(err);
};

const handleCustomErrors = (err, req, res, next) => {
  let error = err;

  if (error.name === 'CustomError') {
    logger.error(`${error}`);
    error = boom.badData(error.message);
  }

  return next(error);
};

module.exports = {
  handleValidationError,
  handleCustomErrors,
  logError,
};

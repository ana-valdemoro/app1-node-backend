const joi = require('joi');
const { validate } = require('express-validation');

const createOrder = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      userUuid: joi.string().uuid(),
      address: joi.string().min(5).max(30).required(),
      productsUuid: joi.array().min(1).items(joi.string().uuid()).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);
const cancelOrder = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      cancellationMessage: joi.string().min(5).max(30),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);
module.exports = {
  createOrder,
  cancelOrder,
};

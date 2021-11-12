const joi = require('joi');
const { validate } = require('express-validation');

const createOrder = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      address: joi.string().min(5).max(30).required(),
      productsUuid: joi.array(),
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
};

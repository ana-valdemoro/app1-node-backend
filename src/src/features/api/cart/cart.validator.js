const joi = require('joi');
const { validate } = require('express-validation');

const createCart = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      userUuid: joi.string().uuid(),
      productsUuid: joi.array().min(1).items(joi.string().uuid()).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putCart = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      productsUuid: joi.array().items(joi.string().uuid()).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);
const deleteCart = validate(
  {
    body: joi.object({}),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createCart,
  putCart,
  deleteCart,
};

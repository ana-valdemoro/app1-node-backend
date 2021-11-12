const joi = require('joi');
const { validate } = require('express-validation');

const createProduct = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      name: joi.string().min(2).max(34).required(),
      price: joi.number().precision(2).positive().required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);
const deleteProduct = validate(
  {
    body: joi.object({}),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putProduct = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      name: joi.string().min(2).max(34).required(),
      price: joi.number().precision(2).positive().required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createProduct,
  putProduct,
  deleteProduct,
};

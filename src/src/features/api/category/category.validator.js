const joi = require('joi');
const { validate } = require('express-validation');

const createCategory = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      name: joi.string().min(2).max(35).required(),
      slug: joi.string().min(2).max(35).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);
const deleteCategory = validate(
  {
    body: joi.object({}),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putCategory = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      name: joi.string().min(2).max(35).required(),
      slug: joi.string().min(2).max(35).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createCategory,
  putCategory,
  deleteCategory,
};

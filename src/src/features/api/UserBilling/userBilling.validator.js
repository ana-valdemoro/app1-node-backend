const joi = require('joi');
const { validate } = require('express-validation');

const createUserBilling = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      dni: joi.string().alphanum().min(9).max(9).required(),
      address: joi.string().min(5).max(30).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putUserBilling = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      dni: joi.string().alphanum().min(9).max(9).required(),
      address: joi.string().min(5).max(30).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const deleteUserBilling = validate(
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
  createUserBilling,
  putUserBilling,
  deleteUserBilling,
};

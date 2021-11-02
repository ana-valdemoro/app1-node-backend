const joi = require('joi');
const { validate } = require('express-validation');

const createUserGroup = validate(
  {
    body: joi.object({
      // eslint-disable-next-line newline-per-chained-call
      name: joi.string().alphanum().min(1).max(30).required(),
      permissions: joi.array(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const deleteUserGroup = validate(
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
  createUserGroup,
  deleteUserGroup,
};

const { UserBilling } = require('../../../models');

const toPublic = (userBilling) => userBilling.toJSON();

module.exports = {
  toPublic,
};

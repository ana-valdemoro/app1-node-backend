const { UserBilling } = require('../../../models');

const toPublic = (userBilling) => userBilling.toJSON();

const createUserBilling = async (data) => {
  const userBilling = await UserBilling.create(data);
  return userBilling.save();
};

module.exports = {
  toPublic,
  createUserBilling,
};

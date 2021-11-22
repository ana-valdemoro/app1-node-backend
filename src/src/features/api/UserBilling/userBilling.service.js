const { UserBilling } = require('../../../models');

const toPublic = (userBilling) => userBilling.toJSON();

const createUserBilling = async (data) => {
  const userBilling = await UserBilling.create(data);
  return userBilling.save();
};

const getUserBilling = async (uuid) => UserBilling.findOne({ where: { uuid } });

const putUserBilling = async (uuid, data) => {
  const user = await getUserBilling(uuid);
  return user.update(data);
};

const deleteUserBilling = async (userBilling) => userBilling.destroy();

module.exports = {
  toPublic,
  createUserBilling,
  putUserBilling,
  deleteUserBilling,
};

const { UserGroup } = require('../../../models');

const toPublic = (userGroup) => userGroup.toJSON();

const getUserGroups = (filters, options) =>
  UserGroup.findAll({
    where: filters,
    order: options.order,
  });

const getUserGroup = async (uuid) =>
  UserGroup.findOne({
    where: {
      uuid,
    },
  });

const createUserGroup = async (data) => {
  const userGroup = UserGroup.create(data);
  return userGroup.save();
};

const putUserGroup = async (uuid, data) => {
  const userGroup = getUserGroup(uuid);
  return userGroup.update(data);
};

const deleteUserGroup = async (userGroup, userId) => {
  await userGroup.delete(userId);
};

module.exports = {
  toPublic,
  getUserGroups,
  getUserGroup,
  createUserGroup,
  putUserGroup,
  deleteUserGroup,
};

// eslint-disable-next-line no-unused-vars
const { User, UserGroup } = require('../../../models');
const jwt = require('../../../utils/middleware/jwt');
const logger = require('../../../config/winston');
const sendinblue = require('../../../utils/lib/email');

const toPublic = (user) => user.toJSON();

const getUserRole = async (user) => UserGroup.findOne({ where: { uuid: user.role_uuid } });

const isUserAuthorized = async (user, role) => {
  console.log(`user: ${JSON.stringify(user)}`);
  const group = await getUserRole(user);

  const userRights = group.permissions.split(',');
  const [roleResource] = role.split(':');

  return (
    userRights.includes('SUPERADMIN') ||
    userRights.includes(`${roleResource}:all`) ||
    userRights.includes(role)
  );
};

const activate = async (token, data) => {
  const user = await User.findOne({ where: { token } });
  return user.update(data);
};

const forgotPassword = async (user) => {
  const token = jwt.generateJWT({
    uuid: user.uuid,
    type: 'user',
  });

  try {
    await sendinblue.sendForgotPassword(user, token);
  } catch (error) {
    logger.info(`${error}`);
  }

  return true;
};

const recoveryPassword = async (token, data) => {
  // TODO: Send email with token for recovery pass
  const payload = jwt.verifyJWT(token);
  const user = await User.findOne({ where: { uuid: payload.uuid } });
  return user.update(data);
};
const getUsersWithUserBillingFilter = async (filters, options) =>
  User.scope('withBilling').findAll({ where: filters, order: options.order });

const getUsers = async (filters, options) => User.findAll({ where: filters, order: options.order });

const getUserByEmail = async (email) => User.findOne({ where: { email } });

const getUser = async (uuid) => User.findOne({ where: { uuid } });

const createUser = async (data) => {
  const dataToCreate = { ...data, token: jwt.generateJWT({ uuid: '', type: 'user' }) };
  const user = await User.create(dataToCreate);
  return user.save();
};

const putUser = async (uuid, data) => {
  const user = await getUser(uuid);
  return user.update(data);
};

const deleteUser = async (user) => user.destroy();

module.exports = {
  toPublic,
  getUserRole,
  isUserAuthorized,
  activate,
  forgotPassword,
  recoveryPassword,
  getUsers,
  getUserByEmail,
  createUser,
  getUser,
  putUser,
  deleteUser,
  getUsersWithUserBillingFilter,
};

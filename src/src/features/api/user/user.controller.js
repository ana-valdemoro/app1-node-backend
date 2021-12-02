const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');
const { UniqueConstraintError } = require('sequelize');
const sendinblue = require('../../../utils/lib/email');
const userService = require('./user.service');
const activityService = require('../activity/activity.service');
const userActivityActions = require('./user.activity');
const authActivityActions = require('../auth/auth.activity');
const queryOptions = require('../../../utils/queryOptions');
const userFilters = require('./user.filters');
const logger = require('../../../config/winston');

const activate = async (req, res, next) => {
  const { token } = req.params;
  let user;
  let userUpdated;

  try {
    if (token !== '') {
      user = await userService.getUserByToken(token);
    }
    if (!user) {
      return next(boom.badData('Este usuario ya tiene la cuenta activada'));
    }
    userUpdated = await userService.activate(user, { active: true, token: '' });
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error));
  }
  try {
    await activityService.createActivity({
      action: authActivityActions.ACTIVATE,
      author: 'Anonymous',
      elementBefore: JSON.stringify(user),
      elementAfter: JSON.stringify(userUpdated),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  return res.json({
    status: 'OK',
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await userService.getUserByEmail(email);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.unauthorized('Usuario no válido'));
  }

  if (!user) {
    return next(boom.unauthorized('El email y la contraseña introducidos no son válidos'));
  }

  try {
    const userHasValidPassword = await user.validPassword(password);

    if (!userHasValidPassword) {
      return next(boom.unauthorized('La contraseña es errónea'));
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badRequest(error.message));
  }

  let response;

  try {
    response = await user.toAuthJSON();
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badRequest(error.message));
  }

  return res.json(response);
};

const register = async (req, res, next) => {
  const userData = req.body;
  let user;
  try {
    user = await userService.createUser(userData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un usuario con el email introducido'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }
  try {
    await sendinblue.sendAccountActivationEmail(user);
  } catch (error) {
    logger.error(`${error}`);
  }

  try {
    await activityService.createActivity({
      action: userActivityActions.CREATE_USER,
      author: 'Anonymous',
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(user.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(user.toJSON());
};

const forgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (user) {
      await userService.forgotPassword(user);
    }
  } catch (error) {
    logger.error(`${error}`);
  }

  return res.json({
    status: 'OK',
    msg: 'Si el email existe, se habrá mandado un email con instrucciones para restablecer su contraseña',
  });
};

const recovery = async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  let user;
  try {
    if (password === confirmPassword) {
      user = await userService.recoveryPassword(token, { password });
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
  try {
    await activityService.createActivity({
      action: authActivityActions.RECOVERY,
      author: 'Anonymous',
      elementBefore: JSON.stringify(user.toJSON()),
      elementAfter: JSON.stringify(user.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }
  return res.json({
    status: 'OK',
  });
};

const listUsers = async (req, res, next) => {
  try {
    const filters = userFilters(req.query);
    const options = queryOptions(req.query);
    console.log(filters);
    options.select = { password: false, _id: false };
    options.leanWithId = false;

    if (req.query.name) {
      return res.json(await userService.getUsersWithUserBillingFilter(filters, options));
    }
    return res.json(await userService.getUsers(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createUser = async (req, res, next) => {
  const userData = req.body;
  let user;
  try {
    user = await userService.createUser(userData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un usuario con el email introducido'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: userActivityActions.CREATE_USER,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(user.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(userService.toPublic(user));
};

const getUser = async (req, res, next) => {
  try {
    if (res.locals && res.locals.user) {
      return res.json(await userService.toPublic(res.locals.user));
    }
    res.json(await userService.toPublic(req.user));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const putUser = async (req, res, next) => {
  let { user } = req;
  if (res.locals && res.locals.user) {
    // eslint-disable-next-line prefer-destructuring
    user = res.locals.user;
  }

  const userData = req.body;
  let userUpdated;

  try {
    const userUuid = user.uuid;
    delete userData.uuid;
    userUpdated = await userService.putUser(userUuid, userData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un usuario con el email introducido'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: userActivityActions.UPDATE_USER,
      author: req.user.email,
      elementBefore: JSON.stringify(user.toJSON()),
      elementAfter: JSON.stringify(userUpdated.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(userService.toPublic(userUpdated));
};

const deleteUser = async (req, res, next) => {
  const { user } = res.locals;
  const userBeforeDelete = cloneDeep(user);

  try {
    await userService.deleteUser(user, req.user._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: userActivityActions.DELETE_USER,
      author: req.user.toJSON(),
      elementBefore: JSON.stringify(userBeforeDelete.toJSON()),
      elementAfter: JSON.stringify({}),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

module.exports = {
  activate,
  login,
  register,
  forgot,
  recovery,
  listUsers,
  getUser,
  createUser,
  putUser,
  deleteUser,
};

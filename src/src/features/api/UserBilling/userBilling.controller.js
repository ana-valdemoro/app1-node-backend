const boom = require('@hapi/boom');
const { UniqueConstraintError } = require('sequelize');
const billingService = require('./userBilling.service');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./userBilling.activity');
const userService = require('../user/user.service');

const getUserBilling = async (req, res, next) => {
  try {
    if (res.locals && res.locals.user) {
      // eslint-disable-next-line camelcase
      const { billing } = res.locals.user;
      if (billing) {
        return res.json(await billingService.toPublic(billing));
      }
      return next(boom.notFound('El usuario no tiene datos fiscales'));
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createUserBilling = async (req, res, next) => {
  const userBillingData = req.body;
  let userBilling;
  try {
    if (res.locals && res.locals.user) {
      // eslint-disable-next-line camelcase
      const { billing } = res.locals.user;
      if (billing !== null) {
        return next(boom.notFound('El usuario ya tiene datos fiscales creados'));
      }
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
  try {
    userBilling = await billingService.createUserBilling(userBillingData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }
  try {
    await userService.putUser(res.locals.user.uuid, {
      billing_id: userBilling.uuid,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un usuario con el mismo billig_id introducido'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }
  try {
    await activityService.createActivity({
      action: activityActions.CREATE_USER_BILLING,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(userBilling.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(billingService.toPublic(userBilling));
};

const putUserBilling = async (req, res, next) => {
  let user;
  if (res.locals && res.locals.user) {
    user = res.locals.user;
    const { billing } = user;
    if (billing === null) {
      return next(boom.notFound('El usuario no tiene datos fiscales creados'));
    }
  }

  const billingData = req.body;
  let response;
  try {
    const billingId = user.billing_id;
    delete billingData.uuid;
    response = await billingService.putUserBilling(billingId, billingData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_USER_BILLING,
      author: req.user.email,
      elementBefore: JSON.stringify(user.toJSON()),
      elementAfter: JSON.stringify(response.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(userService.toPublic(response));
};
module.exports = {
  getUserBilling,
  createUserBilling,
  putUserBilling,
};

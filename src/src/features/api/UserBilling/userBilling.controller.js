const boom = require('@hapi/boom');
const billingService = require('./userBilling.service');
const logger = require('../../../config/winston');

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
module.exports = {
  getUserBilling,
};

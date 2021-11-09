const boom = require('@hapi/boom');
const orderService = require('./order.service');
const queryOptions = require('../../../utils/queryOptions');
const orderFilters = require('./order.filters');
const logger = require('../../../config/winston');

const listOrders = async (req, res, next) => {
  try {
    const filters = orderFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await orderService.getOrders(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
const getOrder = async (req, res, next) => {
  try {
    if (res.locals && res.locals.order) {
      return res.json(await orderService.toPublic(res.locals.order));
    }
    return next(boom.notFound('Order no encontrada'));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
module.exports = {
  listOrders,
  getOrder,
};

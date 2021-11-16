const boom = require('@hapi/boom');
const orderService = require('./order.service');
const productLineService = require('../productLine/productLine.service');
const productService = require('../product/product.service');
const userService = require('../user/user.service');
const queryOptions = require('../../../utils/queryOptions');
const orderFilters = require('./order.filters');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./order.activity');

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
  let order;
  let user;
  try {
    if (res.locals && res.locals.order) {
      order = await orderService.toPublic(res.locals.order);
      try {
        user = await userService.getUser(order.user_uuid);
      } catch (error) {
        logger.error(`No existe usuairo de pedido ${error}`);
      }
      if (user) {
        order.user = await userService.toPublic(user);
      }
      return res.json(order);
    }
    return next(boom.notFound('Order no encontrada'));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
const createOrder = async (req, res, next) => {
  let user;
  let productsUuid;
  const products = [];
  let totalPrice = 0;
  // Obtenemos el usuario
  if (req.user) {
    user = req.user;
  }
  // Obtenemos la lista de productos
  try {
    if (req.body.productsUuid.length === 0) {
      return next(boom.badData('No se puede crear una order sin producto'));
    }
    productsUuid = req.body.productsUuid;
    // eslint-disable-next-line no-restricted-syntax
    for (const productUuid of productsUuid) {
      // eslint-disable-next-line no-await-in-loop
      const productBBDD = await productService.getProduct(productUuid);
      products.push(productBBDD);
      totalPrice = parseFloat(totalPrice) + parseFloat(productBBDD.price);
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.notFound(`producto no encontrado${error.message}`));
  }

  const orderData = {
    address: req.body.address,
    totalPrice,
    status: orderService.ORDER_STATUS_WAITING,
    user_uuid: user.uuid,
  };

  // Creamos la order
  let order;
  try {
    order = await orderService.createOrder(orderData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  // Creamos las lineas de productos
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const product of products) {
      const productLineToCreate = {
        productName: product.name,
        price: product.price,
        order_uuid: order.uuid,
        productUuid: product.uuid,
      };
      // eslint-disable-next-line no-await-in-loop
      await productLineService.createProductLine(productLineToCreate);
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(
      boom.notFound(`Error guardando las promesas de linaeas de productos ${error.message}`),
    );
  }

  // Creamos un registro de la actividad que hemos realizado
  try {
    await activityService.createActivity({
      action: activityActions.CREATE_ORDER,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(order.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(orderService.toPublic(order));
};

const cancelOrder = async (req, res, next) => {
  let { order } = res.locals;
  const { cancellationMessage } = req.body;

  if (order.status !== orderService.ORDER_STATUS_WAITING) {
    return next(boom.badData('No se puede cancelar un pedido que no este parado.'));
  }
  try {
    order = await orderService.cancelOrder(order.uuid, cancellationMessage);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }
  return res.json(await orderService.toPublic(order));
};
module.exports = {
  listOrders,
  getOrder,
  createOrder,
  cancelOrder,
};

const { Order } = require('../../../models');
const userService = require('../user/user.service');
const logger = require('../../../config/winston');
const toPublic = (order) => order.toJSON();

const getOrders = (filters, options) =>
  Order.findAll({
    where: filters,
    order: options.order,
  });
const getOrder = async (uuid) => {
  const order = await Order.findOne({ where: { uuid } });
  try {
    const user = await userService.getUser(order.user_uuid);
    if (user) {
      order.dataValues.user = user;
    }
  } catch (error) {
    logger.error(`${error}`);
  }

  return order;
};

const createOrder = async (data) => {
  const dataToCreate = { ...data, token: '' };
  const product = await Order.create(dataToCreate);
  return product.save();
};

module.exports = {
  toPublic,
  getOrders,
  getOrder,
  createOrder,
};

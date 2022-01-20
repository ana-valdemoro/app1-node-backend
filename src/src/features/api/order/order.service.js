const { Sequelize } = require('sequelize');
const { Order } = require('../../../models');

const ORDER_STATUS_WAITING = 0;
const ORDER_STATUS_PROCESSING = 1;
const ORDER_STATUS_CANCELED = 2;

const toPublic = (order) => order.toJSON();

const getOrders = (filters, options, userUuid) =>
  Order.findAll({
    where: { ...filters, user_uuid: userUuid },
    order: options.order,
  });
const getOrder = async (uuid) => Order.findOne({ where: { uuid } });

const createOrder = async (data) => {
  const order = await Order.create(data);
  return order.save();
};

const putOrder = async (uuid, data) => {
  const order = await getOrder(uuid);
  return order.update(data);
};

const cancelOrder = async (uuid, cancellationMessage) => {
  const data = {
    status: ORDER_STATUS_CANCELED,
  };
  if (
    cancellationMessage &&
    typeof cancellationMessage === 'string' &&
    cancellationMessage.trim() === ''
  ) {
    data.customerCancellationMessage = cancellationMessage.trim();
  }

  return putOrder(uuid, data);
};
const deleteOrder = async (order) => order.destroy();

const getOrderStatisticsByStatus = async () =>
  Order.scope('WithoutUserAndProductLines').findAll({
    group: ['Order.status'],
    attributes: [
      [Sequelize.col('Order.status'), 'status'],
      [Sequelize.fn('count', Sequelize.col('Order.status')), 'totalOrders'],
    ],
  });

module.exports = {
  toPublic,
  getOrders,
  getOrder,
  createOrder,
  ORDER_STATUS_WAITING,
  ORDER_STATUS_PROCESSING,
  ORDER_STATUS_CANCELED,
  cancelOrder,
  deleteOrder,
  putOrder,
  getOrderStatisticsByStatus,
};

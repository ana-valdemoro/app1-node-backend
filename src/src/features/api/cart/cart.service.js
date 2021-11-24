const { Cart } = require('../../../models');

const CART_STATUS_PROCESSING = 0;
const CART_STATUS_FINISHED = 1;

const toPublic = (cart) => cart.toJSON();

const getCarts = (filters, options) =>
  Cart.findAll({
    where: filters,
    order: options.order,
  });
const getCart = async (uuid) => Cart.findOne({ where: { uuid } });

const createCart = async (data) => {
  const cart = await Cart.create(data);
  return cart.save();
};

const putCart = async (uuid, data) => {
  const cart = await getCart(uuid);
  return cart.update(data);
};

const deleteCart = async (cart) => cart.destroy();

module.exports = {
  toPublic,
  getCarts,
  getCart,
  createCart,
  deleteCart,
  putCart,
  CART_STATUS_FINISHED,
  CART_STATUS_PROCESSING,
};

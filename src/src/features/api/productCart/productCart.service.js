const { ProductCart } = require('../../../models');

const toPublic = (productCart) => productCart.toJSON();

const createProductInCart = async (data) => {
  const productCart = await ProductCart.create(data);
  return productCart.save();
};

const deleteProductInCart = async (productInCart) => productInCart.destroy();

module.exports = {
  toPublic,
  createProductInCart,
  deleteProductInCart,
};

const boom = require('@hapi/boom');
const cartService = require('./cart.service');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./cart.activity');
const productCartService = require('../productCart/productCart.service');

async function undoCartCreation(productsInCart, order) {
  try {
    await cartService.deleteCart(order);
    // eslint-disable-next-line no-restricted-syntax
    for (const productInCart of productsInCart) {
      // eslint-disable-next-line no-await-in-loop
      await productCartService.deleteProductInCart(productInCart);
    }
  } catch (rollBackError) {
    logger.error(`${rollBackError}`);
  }
}

const createCart = async (req, res, next) => {
  const userUuid = req.body.userUuid ? req.body.userUuid : req.user.uuid;
  const { productsUuid } = req.body;
  const productsInCart = [];
  let cart;

  const cartToCreate = {
    user_uuid: userUuid,
  };
  // Creamos el carrito
  try {
    cart = await cartService.createCart(cartToCreate);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const productUuid of productsUuid) {
    const productCart = {
      cart_uuid: cart.uuid,
      product_uuid: productUuid,
    };
    try {
      // eslint-disable-next-line no-await-in-loop
      await productCartService.createProductInCart(productCart);
    } catch (error) {
      logger.error(`${error}`);
      undoCartCreation(productsInCart, cart);
      return next(boom.badData('Pos no hemos podido crear los products in cart'));
    }
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_CART,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(cart.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(cartService.toPublic(cart));
};

module.exports = {
  createCart,
};

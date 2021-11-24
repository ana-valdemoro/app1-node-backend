const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');
const cartService = require('./cart.service');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./cart.activity');
const productCartService = require('../productCart/productCart.service');
const queryOptions = require('../../../utils/queryOptions');
const orderFilters = require('./cart.filters');

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
      CartUuid: cart.uuid,
      ProductUuid: productUuid,
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

const listCarts = async (req, res, next) => {
  try {
    const filters = orderFilters(req.query);
    const options = queryOptions(req.query);

    return res.json(await cartService.getCarts(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

async function deleteProductsInCart(products) {
  // eslint-disable-next-line no-restricted-syntax
  for (const product of products) {
    // eslint-disable-next-line no-await-in-loop
    await productCartService.deleteProductInCart(product.ProductCart);
  }
}
const getCart = async (req, res, next) => {
  let cart;
  try {
    if (res.locals && res.locals.cart) {
      cart = await cartService.toPublic(res.locals.cart);
      return res.json(cart);
    }
    return next(boom.notFound('Cart no encontrada'));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
const deleteCart = async (req, res, next) => {
  const { cart } = res.locals;
  const cartBeforeDelete = cloneDeep(cart);

  try {
    await deleteProductsInCart(cart.Products);
  } catch (error) {
    logger.error(`No hemos podido eliminar los productos del carrito: ${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await cartService.deleteCart(cart);
  } catch (error) {
    logger.error(`No hemos podido eliminar el carrito: ${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_CART,
      author: req.user.email,
      elementBefore: JSON.stringify(cartBeforeDelete.toJSON()),
      elementAfter: JSON.stringify({}),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  return res.status(204).json({});
};
async function addProductsInCart(products, cart) {
  // eslint-disable-next-line no-restricted-syntax
  for (const productUuid of products) {
    const productInCart = {
      CartUuid: cart.uuid,
      ProductUuid: productUuid,
    };
    // eslint-disable-next-line no-await-in-loop
    await productCartService.createProductInCart(productInCart);
  }
}

const putCart = async (req, res, next) => {
  let cart;
  if (res.locals && res.locals.cart) {
    // eslint-disable-next-line prefer-destructuring
    cart = res.locals.cart;
  }
  const productsToAddToCart = req.body.productsUuid;
  if (productsToAddToCart.length === 0) {
    return deleteCart(req, res, next);
  }
  // Vacio los productos del carrito
  try {
    await deleteProductsInCart(cart.Products);
  } catch (error) {
    logger.error(`No hemos podido eliminar los productos del carrito: ${error}`);
    return next(boom.badImplementation(error.message));
  }

  // Añadir nuevos productos al carrito
  // eslint-disable-next-line no-restricted-syntax
  try {
    await addProductsInCart(productsToAddToCart, cart);
  } catch (error) {
    logger.error(`Ha habido un error al añadir los productos al carrito: ${error}`);
    return next(boom.badImplementation(error.message));
  }
  let response;
  try {
    response = await cartService.getCart(cart.uuid);
  } catch (error) {
    return next(boom.notFound('Carrito actualizado no encontrado'));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_CART,
      author: req.user.email,
      elementBefore: JSON.stringify(cart.toJSON()),
      elementAfter: JSON.stringify(response),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  return res.json(cartService.toPublic(response));
};

module.exports = {
  createCart,
  listCarts,
  getCart,
  putCart,
  deleteCart,
};

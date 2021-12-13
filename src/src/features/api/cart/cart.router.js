const express = require('express');

const router = express.Router();
const validator = require('./cart.validator');
const cartController = require('./cart.controller');
const authorization = require('../../../utils/middleware/authorization');
const middleware = require('./cart.middleware');

// Listar los carritos
router.get('/', authorization('cart:view'), cartController.listCarts);

// Ver un carrito
router.get('/:cartUuid', authorization('carts:view'), middleware.loadCart, cartController.getCart);

// Crear un carrito
router.post(
  '/',
  authorization('cart:create'),
  validator.createCart,
  middleware.existUserCart,
  cartController.createCart,
);

// Editar un carrito
router.put(
  '/:cartUuid',
  authorization('carts:update'),
  validator.putCart,
  middleware.loadCart,
  cartController.putCart,
);

// Borrar un carrito
router.delete(
  '/:cartUuid',
  authorization('carts:delete'),
  validator.deleteCart,
  middleware.loadCart,
  cartController.deleteCart,
);
// Compra de un carrito
router.post(
  '/:cartUuid/buy',
  authorization('carts:create'),
  validator.buyCart,
  middleware.loadCart,
  cartController.buyCart,
);

module.exports = router;

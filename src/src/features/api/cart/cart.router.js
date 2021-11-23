const express = require('express');

const router = express.Router();
const validator = require('./cart.validator');
const cartController = require('./cart.controller');
const authorization = require('../../../utils/middleware/authorization');

// Listar los carritos
router.get('/', authorization('cart:view'), cartController.listCarts);

// Ver un carrito
// router.get(
//     '/:cartUuid',
//     authorization('orders:view'),
//     middleware.loadCart,
//     cartController.getCart,
//   );

// Crear un carrito
router.post('/', authorization('cart:create'), validator.createCart, cartController.createCart);

// Editar un carrito
// router.put(
//   '/:userUuid',
//   authorization('users:update'),
//   validator.putUser,
//   middleware.loadUser,
//   userController.putUser,
// );

// // Borrar un carrito
// router.delete(
//   '/:userUuid',
//   authorization('users:delete'),
//   validator.deleteUser,
//   middleware.loadUser,
//   userController.deleteUser,
// );

module.exports = router;

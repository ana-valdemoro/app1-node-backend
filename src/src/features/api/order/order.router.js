const express = require('express');

const router = express.Router();
const middleware = require('./order.middleware');
// const validator = require('./product.validator');
const authorization = require('../../../utils/middleware/authorization');
const orderController = require('./order.controller');

// Ver un pedido
router.get(
  '/:orderUuid',
  authorization('orders:view'),
  middleware.loadOrder,
  orderController.getOrder,
);
// ver todos los pedidods
router.get('/', authorization('orders:view'), orderController.listOrders);

// // Crear un producto
// router.post(
//   '/',
//   authorization('products:create'),
//   validator.createProduct,
//   productController.createProduct,
// );

module.exports = router;

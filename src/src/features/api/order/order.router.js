const express = require('express');

const router = express.Router();
const middleware = require('./order.middleware');
const validator = require('./order.validator');
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

// Crear un pedido
router.post(
  '/',
  authorization('orders:create'),
  validator.createOrder,
  orderController.createOrder,
);

module.exports = router;

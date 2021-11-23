const express = require('express');

const router = express.Router();
const validator = require('./cart.validator');
const cartController = require('./cart.controller');
const authorization = require('../../../utils/middleware/authorization');

// Crear un carrito
router.post('/', authorization('cart:create'), validator.createCart, cartController.createCart);


module.exports = router;

const express = require('express');

const router = express.Router();
const middleware = require('./product.middleware');
const validator = require('./product.validator');
const authorization = require('../../../utils/middleware/authorization');
const productController = require('./product.controller');

// Ver un producto
router.get(
  '/:productUuid',
  authorization('products:view'),
  middleware.loadProduct,
  productController.getProduct,
);

router.get('/', authorization('products:view'), productController.listProducts);

// Crear un producto
router.post(
  '/',
  authorization('products:create'),
  validator.createProduct,
  productController.createProduct,
);
// Eliminar un producto
router.delete(
  '/:productUuid',
  authorization('products:delete'),
  validator.deleteProduct,
  middleware.loadProduct,
  productController.deleteProduct,
);
// Editar un producto
router.put(
  '/:productUuid',
  authorization('products:update'),
  validator.putProduct,
  middleware.loadProduct,
  productController.putProduct,
);

module.exports = router;

const express = require('express');

const router = express.Router();
const middleware = require('./product.middleware');
const validator = require('./product.validator');
const { authorize } = require('../../../utils/middleware/jwt');
const authorization = require('../../../utils/middleware/authorization');
const productController = require('./product.controller');

// Ver un producto
router.get('/:productUuid', middleware.loadProduct, productController.getProduct);

router.get('/', productController.listProducts);

// Crear un producto
router.post(
  '/',
  authorize,
  authorization('products:create'),
  validator.createProduct,
  productController.createProduct,
);
// Eliminar un producto
router.delete(
  '/:productUuid',
  authorize,
  authorization('products:delete'),
  validator.deleteProduct,
  middleware.loadProduct,
  productController.deleteProduct,
);
// Editar un producto
router.put(
  '/:productUuid',
  authorize,
  authorization('products:update'),
  validator.putProduct,
  middleware.loadProduct,
  productController.putProduct,
);

module.exports = router;

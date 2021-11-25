const express = require('express');

const router = express.Router();
const middleware = require('./category.middleware');
const validator = require('./category.validator');
const { authorize } = require('../../../utils/middleware/jwt');
const authorization = require('../../../utils/middleware/authorization');
const categoryController = require('./category.controller');

// Ver una categoria
router.get('/:categoryUuid', middleware.loadCategory, categoryController.getCategory);

router.get('/', categoryController.listCategories);

// Crear un producto
router.post(
  '/',
  authorize,
  authorization('categories:create'),
  validator.createCategory,
  categoryController.createCategory,
);
// // Eliminar un categoria
router.delete(
  '/:categoryUuid',
  authorize,
  authorization('categories:delete'),
  validator.deleteCategory,
  middleware.loadCategory,
  categoryController.deleteCategory,
);
// Editar una categoria
router.put(
  '/:categoryUuid',
  authorize,
  authorization('categories:update'),
  validator.putCategory,
  middleware.loadCategory,
  categoryController.putCategory,
);

module.exports = router;

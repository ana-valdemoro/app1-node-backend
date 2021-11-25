const express = require('express');

const router = express.Router();
const middleware = require('./category.middleware');
const productController = require('./category.controller');

// Ver una categoria
router.get('/:categoryUuid', middleware.loadCategory, productController.getCategory);

router.get('/', productController.listCategories);

module.exports = router;

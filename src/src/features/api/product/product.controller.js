const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');
const productService = require('./product.service');
const queryOptions = require('../../../utils/queryOptions');
const productFilters = require('./product.filters');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./product.activity');

const listProducts = async (req, res, next) => {
  const filters = productFilters(req.query);
  const options = queryOptions(req.query);
  let products;
  try {
    products = await productService.getPaginatedProducts(filters, options);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
  // Si las opciones de paginación no están definidas, se devuelven todos los elementos
  // de la base de datos
  const response = {
    data: products.rows,
    page: options.page || 1,
    perPage: options.limit || -1,
    totalItems: products.count,
    totalPages: options.limit ? Math.ceil(products.count / options.limit) : 1,
  };
  return res.json(response);
};
const getProduct = async (req, res, next) => {
  try {
    if (res.locals && res.locals.product) {
      return res.json(await productService.toPublic(res.locals.product));
    }
    res.json(await productService.toPublic(req.user));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
const createProduct = async (req, res, next) => {
  const productData = req.body;
  let product;
  try {
    product = await productService.createProduct(productData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_PRODUCT,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(product.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(productService.toPublic(product));
};

const deleteProduct = async (req, res, next) => {
  const { product } = res.locals;
  const productBeforeDelete = cloneDeep(product);

  try {
    await productService.deleteProduct(product, req.user._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_PRODUCT,
      author: req.user.toJSON(),
      elementBefore: productBeforeDelete.toJSON(),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

const putProduct = async (req, res, next) => {
  let product;
  if (res.locals && res.locals.product) {
    product = res.locals.product;
  }

  const productData = req.body;
  let response;

  try {
    const productUuid = product.uuid;
    delete productData.uuid;
    response = await productService.putProduct(productUuid, productData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_PRODUCT,
      author: req.user.email,
      elementBefore: JSON.stringify(product.toJSON()),
      elementAfter: JSON.stringify(response.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(productService.toPublic(response));
};
module.exports = {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  putProduct,
};

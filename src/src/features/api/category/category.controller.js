const boom = require('@hapi/boom');
// const { cloneDeep } = require('lodash');
const categoryService = require('./category.service');
const queryOptions = require('../../../utils/queryOptions');
const categoryFilters = require('./category.filters');
const logger = require('../../../config/winston');
const listCategories = async (req, res, next) => {
  try {
    const filters = categoryFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await categoryService.getCategories(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
const getCategory = async (req, res, next) => {
  let category;
  try {
    if (res.locals && res.locals.category) {
      category = await categoryService.toPublic(res.locals.category);
      return res.json(category);
    }
    return next(boom.notFound('Categoria no encontrada'));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};
module.exports = {
  listCategories,
  getCategory,
};

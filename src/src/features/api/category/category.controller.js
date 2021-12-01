const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');
const categoryService = require('./category.service');
const queryOptions = require('../../../utils/queryOptions');
const categoryFilters = require('./category.filters');
const logger = require('../../../config/winston');
const activityService = require('../activity/activity.service');
const activityActions = require('./category.activity');

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
const createCategory = async (req, res, next) => {
  const categoryData = req.body;
  let category;
  try {
    category = await categoryService.createCategory(categoryData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_CATEGORY,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(category.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(categoryService.toPublic(category));
};

const deleteCategory = async (req, res, next) => {
  const { category } = res.locals;
  const categoryBeforeDelete = cloneDeep(category);

  try {
    await categoryService.deleteCategory(category, req.user._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_CATEGORY,
      author: req.user.email,
      elementBefore: JSON.stringify(categoryBeforeDelete.toJSON()),
      elementAfter: JSON.stringify({}),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

const putCategory = async (req, res, next) => {
  let category;
  if (res.locals && res.locals.category) {
    category = res.locals.category;
  }

  const categoryData = req.body;
  let response;

  try {
    const categoryUuid = category.uuid;
    delete categoryData.uuid;
    response = await categoryService.putCategory(categoryUuid, categoryData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_CATEGORY,
      author: req.user.email,
      elementBefore: JSON.stringify(category),
      elementAfter: JSON.stringify(response),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(categoryService.toPublic(response));
};
module.exports = {
  listCategories,
  getCategory,
  createCategory,
  deleteCategory,
  putCategory,
};

const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');

const { UniqueConstraintError } = require('sequelize');

const userGroupService = require('./userGroup.service');
const activityService = require('../activity/activity.service');
const activityActions = require('./userGroup.activity');
const queryOptions = require('../../../utils/queryOptions');
const userGroupFilters = require('./userGroup.filters');
const logger = require('../../../config/winston');

const listUserGroups = async (req, res, next) => {
  try {
    const filters = userGroupFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await userGroupService.getUserGroups(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createUserGroup = async (req, res, next) => {
  const userGroupData = req.body;
  let userGroup;

  try {
    userGroup = await userGroupService.createUserGroup(userGroupData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un grupo de usuarios con el nombre introducido'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_USER_GROUP,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(userGroup.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(userGroupService.toPublic(userGroup));
};

const getUserGroup = async (req, res, next) => {
  try {
    res.json(await userGroupService.toPublic(res.locals.userGroup));
  } catch (error) {
    logger.error(`${error}`);
    next(boom.notFound());
  }
};

const putUserGroup = async (req, res, next) => {
  const { userGroup } = res.locals;
  const userGroupData = req.body;
  let response;

  try {
    const userGroupUuid = userGroup.uuid;
    delete userGroup.uuid;
    response = await userGroupService.putUserGroup(userGroupUuid, userGroupData);
  } catch (error) {
    logger.error(`${error}`);
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe un grupo de usuarios con el nombre introducido'));
    }
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_USER_GROUP,
      author: req.user.email,
      elementBefore: JSON.stringify(userGroup.toJSON()),
      elementAfter: JSON.stringify(response.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(userGroupService.toPublic(response));
};

const deleteUserGroup = async (req, res, next) => {
  const { userGroup } = res.locals;
  const userGroupBeforeDelete = cloneDeep(userGroup);

  try {
    await userGroupService.deleteUserGroup(userGroup, req.user._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_USER_GROUP,
      author: req.user.email,
      elementBefore: JSON.stringify(userGroupBeforeDelete.toJSON()),
      elementAfter: JSON.stringify({}),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

module.exports = {
  listUserGroups,
  createUserGroup,
  getUserGroup,
  putUserGroup,
  deleteUserGroup,
};

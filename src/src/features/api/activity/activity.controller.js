const boom = require('@hapi/boom');
const activityService = require('./activity.service');
const logger = require('../../../config/winston');

const listActivity = async (req, res, next) => {
  try {
    res.json(await activityService.listActivity());
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badRequest(error.message));
  }
};

const getActivity = async (req, res, next) => {
  const { activityId } = req.params;
  try {
    res.json(await activityService.getActivity(activityId));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.notFound());
  }
};

module.exports = {
  listActivity,
  getActivity,
};

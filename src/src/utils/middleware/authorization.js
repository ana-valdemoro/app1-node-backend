/* eslint-disable prettier/prettier */
const boom = require('@hapi/boom');
const logger = require('../../config/winston');
const userService = require('../../features/api/user/user.service');

module.exports = (role) =>
  async (req, res, next) => {
    const { user } = req;

    if (user.active === false) {
      logger.error(`User is inactive and has no authorization to "${req.baseUrl}${req.url}"`);
      return next(
        boom.forbidden(`User is inactive and has no authorization to "${req.baseUrl}${req.url}"`),
      );
    }

    try {
      console.log(user);
      const hasPermission = await userService.isUserAuthorized(user, role);

      if (hasPermission) {
        logger.info(`User "${user.name}" has authorization to "${req.baseUrl}${req.url}"`);
        return next();
      }
      logger.error(`User "${user.name}" has no authorization to "${req.baseUrl}${req.url}"`);
      return next(
        boom.forbidden(`User "${user.name}" has no authorization to "${req.baseUrl}${req.url}"`),
      );
    } catch (error) {
      logger.error(`${error}`);
      return next(
        boom.forbidden(`User "${user.name}" has no authorization to "${req.baseUrl}${req.url}"`),
      );
    }
  };

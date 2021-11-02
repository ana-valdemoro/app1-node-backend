const boom = require('@hapi/boom');
const userService = require('../user/user.service');
const logger = require('../../../config/winston');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user) {
    return next(boom.unauthorized('El email y la contraseña introducidos no son válidos'));
  }

  try {
    const userHasValidPassword = await user.validPassword(password);

    if (!userHasValidPassword) {
      return next(boom.unauthorized('La contraseña es errónea'));
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badRequest(error.message));
  }

  let response;

  try {
    response = await user.toAuthJSON();
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badRequest(error.message));
  }

  return res.json(response);
};

module.exports = {
  login,
};

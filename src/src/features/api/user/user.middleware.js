const boom = require('@hapi/boom');
const service = require('./user.service');
const logger = require('../../../config/winston');

async function loadUser(req, res, next) {
  const { userUuid } = req.params;
  let user;

  if (!userUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    user = await service.getUser(userUuid);
  } catch (error) {
    return next(boom.notFound('User no encontrado'));
  }

  if (!user) return next(boom.notFound('User no encontrado'));
  res.locals.user = user;

  next();
}

async function isAdmin(req, res, next) {
  const { email } = req.body;
  let user;
  try {
    user = await service.getUserByEmail(email);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.unauthorized('Ocurrio un error al buscar el user revisar el log'));
  }
  if (!user) {
    return next(boom.unauthorized('El email y la contraseña introducidos no son válidos'));
  }

  try {
    const isUserAthorized = await service.isUserAuthorized(user, 'SUPERADMIN');
    if (isUserAthorized) {
      next();
    } else {
      return next(boom.unauthorized('El usuario no es admin'));
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.unauthorized('Ocurrio otro error al buscar el user revisar el log'));
  }
}
module.exports = {
  loadUser,
  isAdmin,
};

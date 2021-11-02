const boom = require('@hapi/boom');
const service = require('./user.service');

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

module.exports = {
  loadUser,
};

const boom = require('@hapi/boom');
const service = require('./userGroup.service');

async function loadUserGroup(req, res, next) {
  const { userGroupUuid } = req.params;
  let userGroup;

  if (!userGroupUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    userGroup = await service.getUserGroup(userGroupUuid);
  } catch (error) {
    return next(boom.notFound('Grupo de empleados no encontrado'));
  }

  if (!userGroupUuid) return next(boom.notFound('Grupo de empleados no encontrado'));
  res.locals.userGroup = userGroup;

  next();
}

module.exports = {
  loadUserGroup,
};

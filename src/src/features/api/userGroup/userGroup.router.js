const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const userGroupController = require('./userGroup.controller');
const middleware = require('./userGroup.middleware');
const validator = require('./userGroup.validator');

// Ver los grupos
router.get('/', authorization('usersGroups:view'), userGroupController.listUserGroups);
// Crear un grupo
router.post(
  '/',
  authorization('usersGroups:create'),
  validator.createUserGroup,
  userGroupController.createUserGroup,
);
// Obtener un grupo
router.get(
  '/:employeeGroupUuid',
  authorization('usersGroups:view'),
  middleware.loadUserGroup,
  userGroupController.getUserGroup,
);
// Actualizar un grupo
router.put(
  '/:employeeGroupUuid',
  authorization('usersGroups:update'),
  validator.createUserGroup,
  middleware.loadUserGroup,
  userGroupController.putUserGroup,
);
// Borrar un grupo
router.delete(
  '/:employeeGroupUuid',
  authorization('usersGroups:delete'),
  validator.deleteUserGroup,
  middleware.loadUserGroup,
  userGroupController.deleteUserGroup,
);

module.exports = router;

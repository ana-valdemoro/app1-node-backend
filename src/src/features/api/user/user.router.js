const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const userController = require('./user.controller');
const userBillingController = require('../UserBilling/userBilling.controller');
const middleware = require('./user.middleware');
const validator = require('./user.validator');
const userBillingValidator = require('../UserBilling/userBilling.validator');

// Ver datos fiscales de un usuario
router.get(
  '/:userUuid/billing',
  authorization('userBillings:view'),
  middleware.loadUser,
  userBillingController.getUserBilling,
);
// Crear datos fiscales de un usuario
router.post(
  '/:userUuid/billing',
  authorization('userBillings:create'),
  middleware.loadUser,
  userBillingValidator.createUserBilling,
  userBillingController.createUserBilling,
);

// Actualizar los datos fiscales de un usuario
router.put(
  '/:userUuid/billing',
  authorization('userBillings:update'),
  userBillingValidator.putUserBilling,
  middleware.loadUser,
  userBillingController.putUserBilling,
);
// Eliminar los datos fiscales de un usuario
router.delete(
  '/:userUuid/billing',
  authorization('userBillings:delete'),
  userBillingValidator.deleteUserBilling,
  middleware.loadUser,
  userBillingController.deleteUserBilling,
);

// Ver un usuario
router.get('/:userUuid', authorization('users:view'), middleware.loadUser, userController.getUser);

// Listar los usuarios paginados
router.get('/', authorization('users:view'), userController.listUsers);

// Crear un usuario
router.post('/', authorization('users:create'), validator.createUser, userController.createUser);

// Editar un usuario
router.put(
  '/:userUuid',
  authorization('users:update'),
  validator.putUser,
  middleware.loadUser,
  userController.putUser,
);

// Borrar un usuario
router.delete(
  '/:userUuid',
  authorization('users:delete'),
  validator.deleteUser,
  middleware.loadUser,
  userController.deleteUser,
);

module.exports = router;

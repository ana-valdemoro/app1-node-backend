const express = require('express');

const router = express.Router();

const userController = require('../user/user.controller');
const userValidator = require('../user/user.validator');
const middleware = require('../user/user.middleware');

// Activar de usuario
router.post('/activate/:token', userValidator.activateUser, userController.activate);

// Login de admin
router.post('/login/admin', userValidator.loginUser, middleware.isAdmin, userController.login);

// Login del usuario
router.post('/login', userValidator.loginUser, userController.login);

// Register user
router.post('/register', userValidator.createUser, userController.register);

// Send email for recovery pass (User)
router.post('/forgot', userValidator.emailRecoveryUser, userController.forgot);

// Restablecer contraseña (User)
router.post('/recovery', userValidator.recoveryUser, userController.recovery);

module.exports = router;

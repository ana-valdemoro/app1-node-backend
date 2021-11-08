const sequelize = require('sequelize');
const Sequelize = require('../config/db');

const Activity = require('./activity');
const User = require('./user');
const UserGroup = require('./userGroup');
const UserBilling = require('./userBilling');

const models = {
  Activity: Activity.init(Sequelize, sequelize),
  User: User.init(Sequelize, sequelize),
  UserGroup: UserGroup.init(Sequelize, sequelize),
  UserBilling: UserBilling.init(Sequelize, sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  Sequelize,
};

// We export the sequelize connection instance to be used around our app.
module.exports = db;

const sequelize = require('sequelize');
const Sequelize = require('../config/db');

const Activity = require('./activity');
const User = require('./user');
const UserGroup = require('./userGroup');
const UserBilling = require('./userBilling');
const Product = require('./product');
const Order = require('./order');
const ProductLine = require('./productLine');
const Cart = require('./cart');
const ProductCart = require('./productCart');
const Category = require('./category');

const models = {
  Activity: Activity.init(Sequelize, sequelize),
  User: User.init(Sequelize, sequelize),
  UserGroup: UserGroup.init(Sequelize, sequelize),
  UserBilling: UserBilling.init(Sequelize, sequelize),
  Product: Product.init(Sequelize, sequelize),
  Order: Order.init(Sequelize, sequelize),
  ProductLine: ProductLine.init(Sequelize, sequelize),
  Cart: Cart.init(Sequelize, sequelize),
  ProductCart: ProductCart.init(Sequelize, sequelize),
  Category: Category.init(Sequelize, sequelize),
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

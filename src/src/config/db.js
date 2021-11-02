const Sequelize = require('sequelize');
const { resolve } = require('path');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({ path: resolve(__dirname, '../../.env') });
const config = require('./index');

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  config.mysql.name,
  config.mysql.user,
  config.mysql.pass,
  {
    host: config.mysql.host,
    dialect: 'mysql',
    // eslint-disable-next-line no-console
    logging: env === 'development' ? console.log : false,
    port: config.mysql.port,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
  {
    define: {
      freezeTableName: true,
      underscoredAll: true,
      underscored: true,
    },
  },
);

module.exports = sequelize;

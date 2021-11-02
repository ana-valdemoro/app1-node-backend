const { resolve } = require('path');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({ path: resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: 'mysql',
    protocol: 'tcp',
    native: false,
    ssl: undefined,
  },
};

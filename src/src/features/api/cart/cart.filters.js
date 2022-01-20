const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};

  query.deleted = { [Op.ne]: true };

  return query;
};

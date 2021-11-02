const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};

  if (params.name) {
    query.name = {
      [Op.like]: params.name,
    };
  }

  query.deleted = { [Op.ne]: true };

  return query;
};

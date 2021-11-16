const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};
  const orConditions = [];

  if (params.name) {
    orConditions.push({
      name: {
        [Op.like]: `%${params.name}%`,
      },
    });

    orConditions.push({
      '$billing.dni$': {
        [Op.like]: `%${params.name}%`,
      },
    });
    orConditions.push({
      '$billing.address$': {
        [Op.like]: `%${params.name}%`,
      },
    });
    query[Op.or] = orConditions;
  }
  query.deleted = { [Op.ne]: true };

  return query;
};

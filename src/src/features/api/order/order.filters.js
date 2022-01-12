const { Op } = require('sequelize');

module.exports = (params, userUuid) => {
  const query = {};

  if (params.name) {
    query.name = {
      [Op.like]: `%${params.name}%`,
    };
  }
  if (userUuid) {
    query.user_uuid = {
      [Op.eq]: userUuid,
    };
  }

  query.deleted = { [Op.ne]: true };

  return query;
};

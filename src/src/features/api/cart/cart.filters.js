const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};

  if (params.userUuid) {
    query.user_uuid = {
      [Op.eq]: params.userUuid,
    };
  }

  query.deleted = { [Op.ne]: true };

  return query;
};

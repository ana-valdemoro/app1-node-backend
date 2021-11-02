const config = require('../config');

const pagination = {};

pagination.getParams = (page, pageSize) => {
  let limit = parseInt(pageSize, 10) || config.pagination.pageSize;

  if (limit > config.pagination.maxPageSize) {
    limit = config.pagination.maxPageSize;
  }

  return {
    limit,
    page: parseInt(page, 10) || 1,
  };
};

module.exports = pagination;

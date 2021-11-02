const pagination = require('./pagination');

module.exports = (params) => {
  const { page, pageSize } = params;
  let { sort } = params;
  const query = pagination.getParams(page, pageSize);

  if (sort) {
    let order = 'asc';

    if (sort.startsWith('-')) {
      sort = sort.replace('-', '');
      order = 'desc';
    }

    query.sort = {
      [sort]: order === 'asc' ? 1 : -1,
    };
  }

  return query;
};

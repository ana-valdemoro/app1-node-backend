// eslint-disable-next-line no-unused-vars
const { Category } = require('../../../models');

const toPublic = (category) => category.toJSON();

const getCategories = (filters, options) =>
  Category.findAll({
    where: filters,
    order: options.order,
  });

const getCategory = async (uuid) => Category.findOne({ where: { uuid } });

module.exports = {
  toPublic,
  getCategories,
  getCategory,
};

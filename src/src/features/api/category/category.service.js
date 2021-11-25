// eslint-disable-next-line no-unused-vars
const { Category } = require('../../../models');

const toPublic = (category) => category.toJSON();

const getCategories = (filters, options) =>
  Category.findAll({
    where: filters,
    order: options.order,
  });

const getCategory = async (uuid) => Category.findOne({ where: { uuid } });

const createCategory = async (data) => {
  const category = await Category.create(data);
  return category.save();
};

const putCategory = async (uuid, data) => {
  const category = await getCategory(uuid);
  return category.update(data);
};

const deleteCategory = async (category) => category.destroy();

module.exports = {
  toPublic,
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
  putCategory,
};

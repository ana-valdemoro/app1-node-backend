// eslint-disable-next-line no-unused-vars
const { Product } = require('../../../models');

const toPublic = (product) => product.toJSON();

const getProducts = (filters, options) =>
  Product.findAll({
    where: filters,
    order: options.order,
  });

const getProduct = async (uuid) => {
  console.log(uuid);
  return Product.findOne({ where: { uuid } });
};

const createProduct = async (data) => {
  const dataToCreate = { ...data, token: '' };
  const product = await Product.create(dataToCreate);
  return product.save();
};

const putProduct = async (uuid, data) => {
  const product = await getProduct(uuid);
  return product.update(data);
};

const deleteProduct = async (product) => product.destroy();

module.exports = {
  toPublic,
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  putProduct,
};

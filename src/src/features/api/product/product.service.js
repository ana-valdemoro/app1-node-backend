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
  const product = await Product.create(data);
  return product.save();
};

const putProduct = async (uuid, data) => {
  const product = await getProduct(uuid);
  return product.update(data);
};

const getListProductsByUuid = async (uuids) => {
  let products;
  uuids.forEach(async (uuid) => {
    try {
      const productBBDD = await this.getProduct(uuid);
      products.push(productBBDD.dataValues);
    } catch (error) {
      // logger.error(`${error}`);
      // return next(boom.notFound(`producto no encontrado ${error.message}`));
    }
  });
};

const deleteProduct = async (product) => product.destroy();

module.exports = {
  toPublic,
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  putProduct,
  getListProductsByUuid,
};

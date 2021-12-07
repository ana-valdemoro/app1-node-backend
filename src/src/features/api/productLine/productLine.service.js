const { Sequelize } = require('sequelize');
const { ProductLine } = require('../../../models');

const toPublic = (productLine) => productLine.toJSON();

const createProductLine = async (data) => {
  const productLine = await ProductLine.create(data);
  return productLine.save();
};

const deleteProductLine = async (productLine) => productLine.destroy();

const getProductStatics = async () =>
  ProductLine.findAll({
    group: ['product_uuid'],
    attributes: [
      'product_uuid',
      [Sequelize.fn('count', Sequelize.col('product_uuid')), 'totalProducts'],
    ],
  });

module.exports = {
  toPublic,
  createProductLine,
  deleteProductLine,
  getProductStatics,
};

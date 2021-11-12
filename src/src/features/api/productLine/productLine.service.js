const { ProductLine } = require('../../../models');

const toPublic = (productLine) => productLine.toJSON();

const createProductLine = async (data) => {
  const productLine = await ProductLine.create(data);
  return productLine.save();
};

module.exports = {
  toPublic,
  createProductLine,
};

const boom = require('@hapi/boom');
const service = require('./product.service');

async function loadProduct(req, res, next) {
  const { productUuid } = req.params;
  let product;

  if (!productUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    product = await service.getProduct(productUuid);
  } catch (error) {
    return next(boom.notFound('Producto no encontrado'));
  }

  if (!product) return next(boom.notFound('Producto no encontrado'));
  res.locals.product = product;

  next();
}

module.exports = {
  loadProduct,
};

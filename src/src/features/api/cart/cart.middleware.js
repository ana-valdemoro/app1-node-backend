const boom = require('@hapi/boom');
const service = require('./cart.service');

async function loadCart(req, res, next) {
  const { cartUuid } = req.params;
  let cart;

  if (!cartUuid) {
    return next(boom.badData('El identificador de Carrito es obligatorio'));
  }

  try {
    cart = await service.getCart(cartUuid);
  } catch (error) {
    return next(boom.notFound('Carrito no encontrado'));
  }
  if (!cart) return next(boom.notFound('Carrito no encontrado'));

  res.locals.cart = cart;

  next();
}

module.exports = {
  loadCart,
};

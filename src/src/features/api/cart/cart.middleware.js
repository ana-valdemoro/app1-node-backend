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

async function existUserCart(req, res, next) {
  let cart;
  const userUuid = req.body.userUuid || req.user.uuid;
  try {
    cart = await service.getCartByUserUuid(userUuid);
  } catch (error) {
    return next(
      boom.badImplementation('Ha habido un error al comprobar si el usuario tenia un carrito'),
    );
  }
  if (cart) return next(boom.badData('El usuario posee un carrito, no se le puede crear otro'));
  next();
}

module.exports = {
  loadCart,
  existUserCart,
};

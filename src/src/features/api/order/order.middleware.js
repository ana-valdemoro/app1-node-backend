const boom = require('@hapi/boom');
const service = require('./order.service');

async function loadOrder(req, res, next) {
  const { orderUuid } = req.params;
  let order;

  if (!orderUuid) {
    return next(boom.badData('El identificador de pedido es obligatorio'));
  }

  try {
    order = await service.getOrder(orderUuid);
  } catch (error) {
    return next(boom.notFound('Pedido no encontrado'));
  }
  if (!order) return next(boom.notFound('Pedido no encontrado'));

  res.locals.order = order;

  next();
}

module.exports = {
  loadOrder,
};

const boom = require('@hapi/boom');
const service = require('./category.service');

async function loadCategory(req, res, next) {
  const { categoryUuid } = req.params;
  let category;

  if (!categoryUuid) {
    return next(boom.badData('El identificador de la categoria es obligatorio'));
  }

  try {
    category = await service.getCategory(categoryUuid);
  } catch (error) {
    return next(boom.notFound('Categoria no encontrado'));
  }
  if (!category) return next(boom.notFound('Categoria no encontrado'));

  res.locals.category = category;

  next();
}

module.exports = {
  loadCategory,
};

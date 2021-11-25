const uuid = require('uuid');
const { Product, Category } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.bulkInsert('categories', [
        {
          uuid: uuid.v4(),
          name: 'salsas',
          slug: 'salsas',
        },
        {
          uuid: uuid.v4(),
          name: 'bebidas vegetales',
          slug: 'bebidas-vegetales',
        },
        {
          uuid: uuid.v4(),
          name: 'mantequilla y margarina',
          slug: 'mantequilla',
        },
      ]);
      const saucesCategory = await Category.findOne({ where: { name: 'salsas' } });
      const ketchup = await Product.findOne({ where: { name: 'ketchup' } });
      await queryInterface.bulkUpdate(
        'products',
        { category_uuid: saucesCategory.uuid },
        { uuid: ketchup.uuid },
      );
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};

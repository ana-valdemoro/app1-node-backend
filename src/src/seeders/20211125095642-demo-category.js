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
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          uuid: uuid.v4(),
          name: 'bebidas vegetales',
          slug: 'bebidas-vegetales',
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          uuid: uuid.v4(),
          name: 'mantequilla y margarina',
          slug: 'mantequilla',
          updated_at: new Date(),
          created_at: new Date(),
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

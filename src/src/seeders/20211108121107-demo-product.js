const uuid = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.bulkInsert('products', [
        {
          uuid: uuid.v4(),
          name: 'Papel higienico',
          price: 2.33,
        },
        {
          uuid: uuid.v4(),
          name: 'ketchup',
          price: 1.03,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};

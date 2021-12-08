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
          name: 'champu de menta',
          price: 1.33,
        },
        {
          uuid: uuid.v4(),
          name: 'gel de ducha avena',
          price: 0.98,
        },
        {
          uuid: uuid.v4(),
          name: 'ketchup',
          price: 1.03,
        },
        {
          uuid: uuid.v4(),
          name: 'mostaza',
          price: 0.99,
        },
        {
          uuid: uuid.v4(),
          name: 'salsa brava',
          price: 0.99,
        },
        {
          uuid: uuid.v4(),
          name: 'ali oli',
          price: 1.3,
        },
        {
          uuid: uuid.v4(),
          name: 'mojo picón',
          price: 2.99,
        },
        {
          uuid: uuid.v4(),
          name: 'salsa agridulce',
          price: 0.99,
        },
        {
          uuid: uuid.v4(),
          name: 'salsa chimichurri',
          price: 4.67,
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

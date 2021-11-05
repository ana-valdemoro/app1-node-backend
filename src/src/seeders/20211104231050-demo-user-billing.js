const uuid = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.bulkInsert('user_billings', [
        {
          uuid: uuid.v4(),
          dni: '44742568U',
          address: 'Las Palmas',
        },
        {
          uuid: uuid.v4(),
          dni: '48642568L',
          address: 'Telde',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_billings', null, {});
  },
};

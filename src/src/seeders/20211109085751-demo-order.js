const uuid = require('uuid');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    try {
      const admin = await User.findOne({ where: { email: 'admin@admin.com' } });
      if (admin) {
        await queryInterface.bulkInsert('orders', [
          {
            uuid: uuid.v4(),
            address: 'Calle del administrador',
            total_price: 20.98,
            user_uuid: admin.uuid,
          },
          {
            uuid: uuid.v4(),
            address: 'Calle del administrador',
            total_price: 30.98,
            user_uuid: admin.uuid,
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('orders', null, {});
  },
};

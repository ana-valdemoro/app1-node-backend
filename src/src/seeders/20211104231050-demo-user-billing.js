const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { UserBilling, UserGroup } = require('../models');

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

      const password = bcrypt.hashSync('123456', bcrypt.genSaltSync(10));
      const studentsGroup = await UserGroup.findOne({ where: { name: 'Students' } });
      const lasPalmasBilling = await UserBilling.findOne({ where: { address: 'Las Palmas' } });

      await queryInterface.bulkInsert('users', [
        {
          uuid: uuid.v4(),
          name: 'sofia',
          email: 'sofia@gmail.com',
          password,
          role_uuid: studentsGroup.uuid,
          token: '',
          active: true,
          billing_id: lasPalmasBilling.uuid,
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

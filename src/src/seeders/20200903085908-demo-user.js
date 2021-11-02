const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { UserGroup } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.bulkInsert('user_groups', [
        {
          uuid: uuid.v4(),
          name: 'Superadmin',
          permissions: 'SUPERADMIN',
        },
      ]);

      let superAdminGroup = await UserGroup.findAll({ where: { name: 'Superadmin' } });

      if (superAdminGroup.length > 0) {
        superAdminGroup = superAdminGroup.pop();
      }

      const password = bcrypt.hashSync('123456', bcrypt.genSaltSync(10));

      await queryInterface.bulkInsert('users', [
        {
          uuid: uuid.v4(),
          name: 'Administrador',
          email: 'admin@admin.com',
          password,
          role_uuid: superAdminGroup.uuid,
          token: '',
          active: true,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_groups', null, {});
  },
};

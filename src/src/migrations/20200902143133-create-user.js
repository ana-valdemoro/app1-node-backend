module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('users', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      role_uuid: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: 'user_groups',
          },
          key: 'uuid',
        },
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};

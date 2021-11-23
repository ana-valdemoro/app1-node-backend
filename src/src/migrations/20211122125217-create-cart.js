module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('carts', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      user_uuid: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: 'users',
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
    await queryInterface.dropTable('carts');
  },
};

module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('user_groups', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: DataTypes.STRING,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_groups');
  },
};

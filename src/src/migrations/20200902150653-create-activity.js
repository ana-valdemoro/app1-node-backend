module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('activities', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      element_before: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      element_after: {
        type: DataTypes.TEXT,
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
    await queryInterface.dropTable('activities');
  },
};

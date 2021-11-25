module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('products', 'category_uuid', {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
      references: {
        model: {
          tableName: 'categories',
        },
        key: 'uuid',
      },
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('products', 'category_uuid');
  },
};

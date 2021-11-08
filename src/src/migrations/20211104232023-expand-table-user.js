module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'billing_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
      references: {
        model: {
          tableName: 'user_billings',
        },
        key: 'uuid',
      },
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('users', 'billing_id');
  },
};

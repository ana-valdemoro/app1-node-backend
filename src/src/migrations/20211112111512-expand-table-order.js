module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('orders', 'customer_cancellation_message', {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('orders', 'customer_cancellation_message');
  },
};

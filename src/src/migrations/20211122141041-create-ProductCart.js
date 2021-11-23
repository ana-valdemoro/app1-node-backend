module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('product_cart', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      product_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'uuid',
          as: 'product_uuid',
        },
      },
      cart_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'carts',
          },
          key: 'uuid',
          as: 'cart_uuid',
        },
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface) => {
    await queryInterface.dropTable('product_cart');
  },
};

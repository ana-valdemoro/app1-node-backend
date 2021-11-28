const { Sequelize, Model, DataTypes } = require('sequelize');
const Product = require('./product');

class ProductCart extends Model {
  static init(sequelize) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        tableName: 'product_cart',
        defaultScope: {
          include: [
            {
              model: Product,
            },
          ],
        },
      },
    );
  }

  static associate(models) {
    this.cart = models.Product.belongsToMany(models.Cart, {
      through: this,
      foreignKey: {
        name: 'ProductUuid',
        field: 'product_uuid',
        defaultValue: null,
        type: DataTypes.STRING,
      },
    });
    this.product = models.Cart.belongsToMany(models.Product, {
      through: this,
      foreignKey: {
        name: 'CartUuid',
        field: 'cart_uuid',
        defaultValue: null,
        type: DataTypes.STRING,
      },
    });
  }
}

module.exports = ProductCart;

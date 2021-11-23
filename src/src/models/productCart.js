const { Sequelize, Model } = require('sequelize');
const Product = require('./product');
const Cart = require('./cart');

class ProductCart extends Model {
  static init(sequelize, DataTypes) {
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
      foreignKey: 'ProductUuid',
    });
    this.product = models.Cart.belongsToMany(models.Product, {
      through: this,
      foreignKey: 'CartUuid',
    });
  }
}

module.exports = ProductCart;

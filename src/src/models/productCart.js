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
            { model: Product, as: 'products' },
            { model: Cart, as: 'carts' },
          ],
        },
      },
    );
  }

  // static associate(models) {
  //   this.cart = this.belongsTo(models.Cart, { foreignKey: 'cart_uuid', as: 'carts' });
  // eslint-disable-next-line max-len
  //   this.product = this.belongsTo(models.Product, { foreignKey: 'product_uuid', as: 'products' });
  // }
}

module.exports = ProductCart;

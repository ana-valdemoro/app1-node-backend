const { Sequelize, Model } = require('sequelize');
const User = require('./user');
const Product = require('./product');

class Cart extends Model {
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
        status: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        defaultScope: {
          include: [{ model: User, as: 'user' }, { model: Product }],
        },
      },
    );
  }

  static associate(models) {
    this.user = this.belongsTo(models.User, { as: 'user', foreignKey: 'user_uuid' });
    this.productCart = this.belongsToMany(models.Product, {
      through: models.ProductCart,
      foreignKey: 'ProductUuid',
    });
  }
}

module.exports = Cart;

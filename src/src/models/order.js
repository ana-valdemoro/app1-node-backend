const { Sequelize, Model } = require('sequelize');
const ProductLine = require('./productLine');

class Order extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
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
        modelName: 'Order',
        defaultScope: {
          include: [{ model: ProductLine, as: 'productLines', required: true }],
        },
      },
    );
  }

  static associate(models) {
    this.user = this.belongsTo(models.User, { as: 'user', foreignKey: 'user_uuid' });
    this.productLines = this.hasMany(models.ProductLine, {
      as: 'productLines',
    });
  }
}

module.exports = Order;

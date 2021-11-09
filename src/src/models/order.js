const { Sequelize, Model } = require('sequelize');

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
        state: {
          type: DataTypes.STRING,
          defaultValue: 'waiting',
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Order',
      },
    );
  }

  static associate(models) {
    this.user = this.belongsTo(models.User, { as: 'user', foreignKey: 'user_uuid' });
  }
}

module.exports = Order;

const { Sequelize, Model } = require('sequelize');

class ProductLine extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        productName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
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
        modelName: 'ProductLine',
        defaultScope: {
          include: [
            {
              all: true,
              nested: false,
            },
          ],
        },
      },
    );
  }

  static associate(models) {
    this.order = this.belongsTo(models.Order, { as: 'order', foreignKey: 'order_uuid' });
    this.product = this.belongsTo(models.Product, { as: 'product', foreignKey: 'product_uuid' });
  }
}

module.exports = ProductLine;

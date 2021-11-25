const { Sequelize, Model } = require('sequelize');
const Category = require('./category');

class Product extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
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
        modelName: 'Product',
        defaultScope: {
          include: [{ model: Category, as: 'category' }],
        },
      },
    );
  }

  static associate(models) {
    this.productCart = this.belongsToMany(models.Cart, {
      through: models.ProductCart,
    });
    this.category = this.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_uuid',
    });
  }
}

module.exports = Product;

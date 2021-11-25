const { Sequelize, Model } = require('sequelize');

class Category extends Model {
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
        slug: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Category',
      },
    );
  }

  static associate(models) {
    this.category = this.hasMany(models.Product);
  }
}

module.exports = Category;

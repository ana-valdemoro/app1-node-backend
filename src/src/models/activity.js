const { Sequelize, Model } = require('sequelize');

class Activity extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        action: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        author: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        elementBefore: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        elementAfter: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Activity',
      },
    );
  }
}

module.exports = Activity;

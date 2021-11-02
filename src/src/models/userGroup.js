/* eslint-disable no-param-reassign */
const { Sequelize, Model } = require('sequelize');

class UserGroup extends Model {
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
          unique: true,
        },
        permissions: {
          type: DataTypes.STRING,
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
        modelName: 'UserGroup',
      },
    );
  }
}

module.exports = UserGroup;

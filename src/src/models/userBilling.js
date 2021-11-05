const { Sequelize, Model } = require('sequelize');

class UserBilling extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        dni: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: DataTypes.STRING,
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'UserBilling',
        // tableName: 'tax_datas',
      },
    );
  }
}

module.exports = UserBilling;

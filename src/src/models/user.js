/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt');
const { Sequelize, Model } = require('sequelize');
const UserGroup = require('./userGroup');
const UserBilling = require('./userBilling');
const jwt = require('../utils/middleware/jwt');

class User extends Model {
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        modelName: 'User',
        hooks: {
          beforeCreate(attributes) {
            attributes.set(
              'password',
              bcrypt.hashSync(attributes.get('password', { plain: true }), bcrypt.genSaltSync(10)),
            );
          },
          beforeUpdate(instance) {
            if (instance.changed() && instance.changed().indexOf('password')) {
              instance.set(
                'password',
                bcrypt.hashSync(instance.get('password', { plain: true }), bcrypt.genSaltSync(10)),
              );
            }
          },
        },
        defaultScope: {
          include: [
            {
              all: true,
              nested: true,
            },
          ],
        },
        scopes: {
          withBilling: {
            include: [
              { model: UserGroup, as: 'role' },
              { model: UserBilling, as: 'billing', required: true },
            ],
          },
        },
      },
    );
  }

  static associate(models) {
    this.role = this.belongsTo(models.UserGroup, { as: 'role', foreignKey: 'role_uuid' });
    this.billing = this.belongsTo(models.UserBilling, { as: 'billing', foreignKey: 'billing_id' });
    // Esto es opcional
    // this.orders = this.hasMany(models.Order, { as: 'orders' });
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  toJSON() {
    const values = { ...this.get() };

    delete values.password;
    return values;
  }

  toAuthJSON() {
    const values = { ...this.get() };
    values.token = jwt.generateJWT({
      uuid: values.uuid,
      type: 'user',
    });
    delete values.password;
    return values;
  }
}

module.exports = User;

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Payment, {
        foreignKey: 'user'
      });

      User.hasMany(models.BankAccount, {
        foreignKey: 'owner'
      });
    }
  }
  User.init(
    {
      bvn: DataTypes.STRING(11),
      hashedpassword: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      accountid: {
        type: DataTypes.STRING,
        unique: true
      },
      accounttype: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true }
      },
      firstname: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      middlename: DataTypes.STRING(30),
      lastname: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(14),
        allowNull: false
      },
      lastseen: {
        allowNull: true,
        type: DataTypes.DATE
      },
      lasttnx: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users'
    }
  );
  return User;
};
